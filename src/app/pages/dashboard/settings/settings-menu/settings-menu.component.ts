import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { delay } from 'rxjs/operators';
import { DialogConfirmComponent } from 'src/app/components/dialog-confirm/dialog-confirm.component';
import { LoginService } from 'src/app/services/login.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent implements OnInit {
  @ViewChild('profile', { static: true }) profile: MatExpansionPanel;
  @ViewChild('about', { static: true }) about: MatExpansionPanel;
  private user: any;

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private profileService: ProfileService,
    private store: Store,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.store
      .select(({ profile }: any) => ({ user: profile.user }))
      .subscribe(async (state) => (this.user = state.user));
  }

  public closePanel(): void {
    this.profile.close();
    this.about.close();
  }

  public deleteAccount(): void {
    this.dialog
      .open(DialogConfirmComponent, { data: {}, panelClass: 'dialog-default' })
      .beforeClosed()
      .subscribe((response) => {
        if (response) {
          this.snackbar.open('excluindo sua conta aguarde...');
          this.profileService
            .profileDeleteUser(this.user)
            .pipe(delay(3000))
            .subscribe(
              (res) => {
                this.loginService.sessionIsOver('Sessão encerrada.');
                this.snackbar.open(res.message, 'ok');
              },
              (err) => {
                this.snackbar.open(err.error.message);
              }
            );
        }
      });
  }
}
