import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashboardService } from 'src/app/services/dashboard.service';

@Component({
  selector: 'app-settings-new-password',
  templateUrl: './settings-new-password.component.html',
  styleUrls: ['./settings-new-password.component.scss'],
})
export class SettingsNewPasswordComponent implements OnInit {
  public formAccount: FormGroup;
  public isPasswordSame = false;
  public hide = false;
  public isLoading = false;

  constructor(
    protected fb: FormBuilder,
    protected dashboardService: DashboardService,
    protected snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.formAccount = this.fb.group(
      {
        old_password: [
          '',
          [
            Validators.required,
            Validators.maxLength(24),
            Validators.minLength(6),
          ],
        ],
        new_password: [
          '',
          [
            Validators.required,
            Validators.maxLength(24),
            Validators.minLength(6),
          ],
        ],
        confirm_password: [
          '',
          [
            Validators.required,
            Validators.maxLength(24),
            Validators.minLength(6),
          ],
        ],
      },
      { validator: this.checkPassword('new_password', 'confirm_password') }
    );
  }

  public onAccountSubmit(): void {
    this.isLoading = true;
    this.dashboardService.userUpdatePassword(this.formAccount.value).subscribe(
      (res) => {
        console.log(res);
        this.isLoading = false;
        this.snackbar.open(res.message, 'ok', { duration: 3000 });
      },
      (err) => {
        this.isLoading = false;
        this.snackbar.open(err.error.message, 'ok', { duration: 3000 });
      }
    );
  }
  public checkPassword(controlName: string, matchingControlName: string) {
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
}
