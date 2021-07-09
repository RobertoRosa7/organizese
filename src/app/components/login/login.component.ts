import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  KeyValueDiffers,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { RESET_ERRORS } from 'src/app/actions/errors.actions';
import * as actionsLogin from '../../actions/login.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, DoCheck {
  @Input() public dialog = '';
  @Output() public trigger = new EventEmitter();

  public textIcon = 'password';
  public changeIcon = 'visibility_off';
  public changeTextLogin = 'Não tenho conta';
  public isLogin = false;
  public isLoginText = 'Fechar';
  public isLoading = false;
  public differ: any;
  public errors$: Observable<any>;
  public isDark$: Observable<boolean>;
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
    private fb: FormBuilder,
    private router: Router,
    private store: Store,
    private snackbar: MatSnackBar,
    private diff: KeyValueDiffers,
    private as?: ActionsSubject
  ) {
    this.differ = this.diff.find({}).create();
  }

  public ngOnInit(): void {
    this.isLoginText = this.dialog === 'page-login' ? 'voltar' : 'fechar';

    this.isDark$ = this.store
      .select(({ dashboard }: any) => ({
        theme: dashboard.dark_mode,
      }))
      .pipe(map((state) => state.theme !== 'dark-mode'));
  }

  public ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {});
    }
  }

  public async onSubmit(event: any): Promise<any> {
    event.preventDefault();
    this.isLoading = true;
    this.store.dispatch(actionsLogin.LOGOUT());
    this.store.dispatch(actionsLogin.SIGNIN({ payload: this.formLogin.value }));

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
      this.trigger.emit({ operation: 'close', data: 'login' });
    }
  }

  public forgetPassword(event: any): void {
    if (this.isLoading) {
      event.preventDefault();
    } else {
      this.router.navigateByUrl('/login/reset').then();
      this.close();
    }
  }

  public noAccount(event: any): void {
    if (this.isLoading) {
      event.preventDefault();
    } else {
      this.router.navigateByUrl('/login/signup').then();
      this.close();
    }
  }

  public close(options?: any): void {
    options === 'page-login'
      ? this.router.navigateByUrl('/')
      : this.trigger.emit({ operation: 'close', data: options });
  }

  private onToken(): Promise<string> {
    return new Promise((resolve) => {
      this.as
        ?.pipe(filter((a) => a.type === actionsLogin.actionsTypes.SET_TOKEN))
        .subscribe(({ payload }: any) => resolve(payload));
    });
  }
}
