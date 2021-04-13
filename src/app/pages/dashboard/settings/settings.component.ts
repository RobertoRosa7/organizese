import { Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { DashboardComponent } from '../dashboard.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder } from '@angular/forms';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UtilsService } from 'src/app/utils/utis.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { ProfileService } from 'src/app/services/profile.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent
  extends DashboardComponent
  implements OnInit, DoCheck {
  public differ: any;

  public settingsMenu = [
    {
      subtitle: 'Definir seu nome ou e-mail',
      is_button: false,
      icon: 'person',
      label: 'Perfil',
      target: 'profile',
    },
    {
      subtitle: 'Definir nova senha',
      is_button: false,
      icon: 'vpn_key',
      label: 'Nova senha',
      target: 'new-password',
    },
    {
      subtitle: 'Sobre o app',
      is_button: false,
      icon: 'info',
      label: 'Sobre',
      target: 'about',
    },
  ];

  constructor(
    protected store: Store,
    protected snackbar: MatSnackBar,
    protected fb: FormBuilder,
    protected dashboardService: DashboardService,
    protected utilsService: UtilsService,
    protected differs: KeyValueDiffers,
    protected breakpointObserver: BreakpointObserver,
    protected dialog: MatDialog,
    protected profileService: ProfileService,
    protected router: Router
  ) {
    super();
    breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
    this.differ = this.differs?.find({}).create();
  }

  public ngOnInit(): void {}

  public ngDoCheck(): any {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {});
    }
  }
}
