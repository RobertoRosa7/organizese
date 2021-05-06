import { Component, KeyValueDiffers, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActionsSubject, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

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
    private diff: KeyValueDiffers,
    private as?: ActionsSubject
  ) {}

  public ngOnInit(): void {}

  public onTrigger(event: any): void {
    if (event.operation === 'close' && event.data === 'login') {
      this.router.navigateByUrl('/dashboard');
    }
  }

  public close(options?: any): void {}
  public onSubmit(event: any): void {
    event.preventDefault();
  }
}
