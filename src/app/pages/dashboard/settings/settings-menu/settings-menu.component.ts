import { Component, OnInit, Renderer2, RendererFactory2, ViewChild } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatExpansionPanel } from '@angular/material/expansion'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Router } from '@angular/router'
import { Store } from '@ngrx/store'
import { delay } from 'rxjs/operators'
import { DialogConfirmComponent } from 'src/app/components/dialog-confirm/dialog-confirm.component'
import { ProfileService } from 'src/app/services/profile.service'
import * as actionsLogin from '../../../../actions/login.actions'


@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent implements OnInit {
  @ViewChild('profile', { static: true }) profile: MatExpansionPanel
  @ViewChild('about', { static: true }) about: MatExpansionPanel
  private user: any

  constructor(
    private _dialog: MatDialog,
    private _snackbar: MatSnackBar,
    private _profileService: ProfileService,
    private _store: Store,
    private _router: Router
  ) {
  }

  ngOnInit(): void {
    this._store.select(({ profile }: any) => ({ user: profile.user })).subscribe(async state => this.user = state.user)
  }

  public closePanel(): void {
    this.profile.close()
    this.about.close()
  }

  public deleteAccount(): void {
    this._dialog.open(DialogConfirmComponent, { data: {}, panelClass: 'dialog-default' })
      .beforeClosed().subscribe(response => {
        if (response) {
          this._snackbar.open('excluindo sua conta aguarde...')
          this._profileService.profileDeleteUser(this.user).pipe(delay(3000)).subscribe(
            (res) => {
              this._store.dispatch(actionsLogin.LOGOUT())
              this._router.navigateByUrl('/')
              this._snackbar.open(res.message, 'ok')
            }, (err) => {
              this._snackbar.open(err.error.message)
            })
        }
      })
  }

}
