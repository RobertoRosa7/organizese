import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  public isLoading = false;

  public formReset: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  constructor(
    private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router,
    private loginService: LoginService
  ) {}

  public ngOnInit(): void {}

  public onSubmit(event: any): void {
    event.preventDefault();
    this.isLoading = true;

    this.loginService
      .mailToReset({ email: this.formReset.value.email })
      .subscribe(
        (res) => {
          this.snackbar.open(res.message, 'ok', { duration: 3000 });
          this.isLoading = false;
        },
        (err) => {
          console.error(err);
          this.isLoading = false;
          this.snackbar.open(err.error.message, 'ok', { duration: 3000 });
        }
      );
  }

  public toSignup(event: MouseEvent): void {
    this.isLoading
      ? event.preventDefault()
      : this.router.navigateByUrl('/login/signup');
  }

  public toLogin(event: MouseEvent): void {
    this.isLoading
      ? event.preventDefault()
      : this.router.navigateByUrl('/login');
  }
}
