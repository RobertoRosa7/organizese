import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrls: ['./new-password.component.scss'],
})
export class NewPasswordComponent implements OnInit {
  public isPasswordSame = false;
  public textIcon = 'password';
  public changeIcon = 'visibility_off';
  public changeTextLogin = 'Não tenho conta';
  public isLogin = false;
  public isLoginText = 'login';
  public isLoading = false;
  public token = '';

  public formNewPassword: FormGroup = this.fb.group(
    {
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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private fb: FormBuilder,
    private snackbar: MatSnackBar
  ) {}

  public ngOnInit(): void {
    this.activatedRoute.queryParams
      .pipe(
        switchMap((params: any) => {
          if (params.token) {
            this.token = params.token;
            return this.loginService.loginVerified({ token: params.token });
          } else {
            return of(null);
          }
        })
      )
      .subscribe(
        () => {
          this.isLoading = false;
          console.log('token validado');
        },
        (err) => {
          this.router.navigateByUrl('/');
          this.snackbar.open('Nenhum token encontrado ou token inválido');
        }
      );
  }

  public onSubmit(event: any): void {
    event.preventDefault();
    this.isLoading = true;
    this.loginService
      .resetPassword({
        password: this.formNewPassword.value.password,
        token: this.token,
      })
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.snackbar.open(res.message, 'ok');
        },
        (err) => {
          console.error(err);
          this.isLoading = false;
          this.snackbar.open(err.error.message, 'ok');
        }
      );
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

  public changeVisibility(str: string): void {
    this.textIcon = str === 'password' ? 'text' : 'password';
    this.changeIcon = str === 'password' ? 'visibility' : 'visibility_off';
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
}
