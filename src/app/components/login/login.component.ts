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
import { delay, filter } from 'rxjs/operators';
import * as actionsErrors from '../../actions/errors.actions';
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
    this.store
      .select(({ http_error }: any) => ({ errors: http_error.errors }))
      .pipe(delay(3000))
      .subscribe((state) => {
        if (state.errors.length > 0) {
          state.errors.forEach((e: any) => {
            const msg = e.error.message ? e.error.message : e.error;
            this.snackbar.open(msg, 'ok');
            this.isLoading = false;
            this.trigger.emit({ operation: 'hide-progressbar', data: {} });
            this.store.dispatch(actionsErrors.RESET_ERRORS());
          });
        }
      });

    this.as
      ?.pipe(filter((a) => a.type === actionsErrors.actionsTypes.SET_SUCCESS))
      .subscribe(({ payload }: any) => {
        if (payload === 'login') {
          this.snackbar.open('Login realizado com sucesso', 'Ok', {
            duration: 3000,
          });
          this.trigger.emit({ operation: 'close', data: payload });
        }
      });

    this.isLoginText = this.dialog == 'page-login' ? 'voltar' : 'fechar';
  }

  public ngDoCheck() {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {});
    }
  }

  public onSubmit(event: any): void {
    event.preventDefault();
    this.isLoading = true;
    this.trigger.emit({ operation: 'show-progressbar', data: {} });
    this.store.dispatch(actionsLogin.SIGNIN({ payload: this.formLogin.value }));
  }

  public changeVisibility(str: string): void {
    this.textIcon = str == 'password' ? 'text' : 'password';
    this.changeIcon = str == 'password' ? 'visibility' : 'visibility_off';
  }

  public forgetPassword(event: any) {
    if (this.isLoading) {
      event.preventDefault();
    } else {
      this.router.navigateByUrl('/login/reset').then();
      this.close();
    }
  }

  public noAccount(event: any) {
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
}
