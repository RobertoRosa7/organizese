import { Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { DashboardComponent } from '../dashboard.component'
import { MatSnackBar } from '@angular/material/snack-bar'
import { FormBuilder } from '@angular/forms'
import { DashboardService } from 'src/app/services/dashboard.service'
import { UtilsService } from 'src/app/utils/utis.service'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { MatDialog } from '@angular/material/dialog'
import { ProfileService } from 'src/app/services/profile.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends DashboardComponent implements OnInit, DoCheck {
  public differ: any

  public settingsMenu = [
    {
      subtitle: 'definir seu nome ou e-mail',
      is_button: false,
      icon: 'person',
      label: 'Perfil',
      target: 'profile'
    },
    {
      subtitle: 'definir nova senha',
      is_button: false,
      icon: 'vpn_key',
      label: 'Nova senha',
      target: 'new-password'
    },
    {
      subtitle: 'sobre o app',
      is_button: false,
      icon: 'info',
      label: 'Sobre',
      target: 'about'
    },
  ]

  constructor(
    protected _store: Store,
    protected _snackbar: MatSnackBar,
    protected _fb: FormBuilder,
    protected _dashboardService: DashboardService,
    protected _utilsService: UtilsService,
    protected _differs: KeyValueDiffers,
    protected _breakpointObserver: BreakpointObserver,
    protected _dialog: MatDialog,
    protected _profileService: ProfileService,
    protected _router: Router
  ) {
    super()
    _breakpointObserver.observe([Breakpoints.XSmall]).subscribe(result => this.isMobile = !!result.matches)
    this.differ = this._differs?.find({}).create()
  }

  public ngOnInit(): void {
  }

  public ngDoCheck() {
    const change = this.differ.diff(this)
    if (change) {
      change.forEachChangedItem((item: any) => { })
    }
  }
}
