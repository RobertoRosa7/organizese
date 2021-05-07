import { Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RESET_ERRORS } from 'src/app/actions/errors.actions';
import { Signup } from 'src/app/models/models';
import * as actionsLogin from '../../../actions/login.actions';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, DoCheck {
  public textIcon = 'password';
  public changeIcon = 'visibility_off';
  public changeTextLogin = 'Não tenho conta';
  public isLogin = false;
  public isLoginText = 'login';
  public isLoading = false;
  public isPasswordSame = false;
  public differ: any;
  public createdUser = false;
  public changeTexts = true;
  public errors$: Observable<any>;
  public formSignup: FormGroup = this.fb.group(
    {
      email: ['', [Validators.required, Validators.email]],
      keep_connect: [false],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
        ],
      ],
      confirm_password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(24),
        ],
      ],
    },
    { validator: this.checkPassword('password', 'confirm_password') }
  );

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private snackbar: MatSnackBar,
    private router: Router,
    private diff: KeyValueDiffers,
    private as: ActionsSubject
  ) {
    this.differ = this.diff.find({}).create();
  }

  public ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'createdUser') {
          if (this.createdUser) {
            this.isLoading = false;
            this.snackbar.open('E-mail cadastrado, verifique seu e-mail', 'ok');
          }
        }
      });
    }
  }

  public ngOnInit(): void {
    this.store
      .select(({ login }: any) => ({
        createdUser: login.createdUser,
      }))
      .subscribe((state) => (this.createdUser = state.createdUser));
  }

  public checkPassword(controlName: string, matchingControlName: string): any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
        this.isPasswordSame = matchingControl.status === 'VALID' ? true : false;
      } else {
        matchingControl.setErrors(null);
        this.isPasswordSame = matchingControl.status === 'VALID' ? true : false;
      }
    };
  }

  public async onSubmit(event: any): Promise<any> {
    event.preventDefault();
    this.isLoading = true;

    const payload: Signup = {
      password: this.formSignup.value.password,
      email: this.formSignup.value.email,
      created_at: new Date().getTime() / 1000,
      verified: false,
    };

    this.store.dispatch(actionsLogin.CREATE_USER({ payload }));

    this.errors$ = this.store
      .select(({ http_error }: any) => ({
        error:
          http_error.error.source === 'signup'
            ? http_error.error.error
            : undefined,
      }))
      .pipe(
        map((states) => {
          if (states.error?.message) {
            this.isLoading = false;
          }
          return states;
        })
      );

    this.formSignup.valueChanges.subscribe(() =>
      this.store.dispatch(RESET_ERRORS())
    );

    const user = await this.onUser();

    if (user) {
      this.snackbar.open('Usuário cadastrado verifique seu e-mail!');
      this.isLoading = false;
      this.formSignup.reset();
    }
  }

  public forgetPassword(event: any): void {
    this.isLoading
      ? event.preventDefault()
      : this.router.navigateByUrl('/login/reset');
  }

  public noAccount(event: any): void {
    this.isLoading
      ? event.preventDefault()
      : this.router.navigateByUrl('/login');
  }

  private onUser(): Promise<any> {
    return new Promise((resolve) => {
      this.as
        ?.pipe(filter((a) => a.type === actionsLogin.actionsTypes.CREATED_USER))
        .subscribe((payload) => resolve(payload));
    });
  }
}
