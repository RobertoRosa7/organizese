import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RESET_ERRORS } from 'src/app/actions/errors.actions';
import { actionsTypes, SIGNIN } from '../../../actions/login.actions';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  public textIcon = 'password';
  public changeIcon = 'visibility_off';
  public changeTextLogin = 'Não tenho conta';
  public isLogin = false;
  public isLoginText = 'Fechar';
  public isLoading = false;
  public differ: any;
  public errors$: Observable<any>;
  public changeTexts = true;
  public formLogin: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    keep_connect: [false],
    password: [
      '',
      [Validators.required, Validators.minLength(6), Validators.maxLength(24)],
    ],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store,
    private snackbar: MatSnackBar,
    private as: ActionsSubject
  ) {}

  public ngOnInit(): void {}

  public close(options?: any): void {}

  public async onSubmit(event: Event): Promise<any> {
    event.preventDefault();
    this.isLoading = true;

    this.store.dispatch(SIGNIN({ payload: this.formLogin.value }));

    this.errors$ = this.store
      .select(({ http_error }: any) => ({
        error:
          http_error.error.source === 'signin'
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

    this.formLogin.valueChanges.subscribe(() =>
      this.store.dispatch(RESET_ERRORS())
    );

    const payload = await this.onToken();

    if (payload) {
      this.snackbar.open('Login realizado com sucesso', 'Ok', {
        duration: 3000,
      });
      this.router.navigateByUrl('/dashboard');
    }
  }

  private onToken(): Promise<string> {
    return new Promise((resolve) => {
      this.as
        ?.pipe(filter((a) => a.type === actionsTypes.SET_TOKEN))
        .subscribe(({ payload }: any) => resolve(payload));
    });
  }
}
