import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DialogsComponent } from 'src/app/components/dialogs/dialogs.component';
import { DownloadsComponent } from 'src/app/components/downloads/downloads.component';
import { LoginComponent } from 'src/app/components/login/login.component';
import { SearchComponent } from 'src/app/components/search/search.component';
import { MaterialModule } from 'src/app/material.module';
import { LoginService } from 'src/app/services/login.service';
import { NewPasswordComponent } from './new-password/new-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerifyComponent } from './verify/verify.component';

const routes: Routes = [
  { path: '', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'reset', component: ResetPasswordComponent },
  { path: 'verify', component: VerifyComponent },
  { path: 'new_password', component: NewPasswordComponent },
];

@NgModule({
  declarations: [
    LoginComponent,
    SignInComponent,
    SignUpComponent,
    ResetPasswordComponent,
    VerifyComponent,
    NewPasswordComponent,
    DownloadsComponent,
    DialogsComponent,
    SearchComponent,
  ],
  imports: [MaterialModule, RouterModule.forChild(routes)],
  providers: [{ provide: LoginService }],
})
export class LoginModule {}
