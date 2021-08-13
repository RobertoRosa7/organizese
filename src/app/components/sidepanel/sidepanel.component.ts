import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { LoginService } from 'src/app/services/login.service';
import * as actionsApp from '../../actions/app.actions';
import * as actionsDashboard from '../../actions/dashboard.actions';
import * as actionsLogin from '../../actions/login.actions';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { DialogsComponent } from '../dialogs/dialogs.component';

@Component({
  selector: 'app-sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.scss'],
})
export class SidepanelComponent implements OnInit {
  @Input() showText: boolean = true;
  @Output() send = new EventEmitter();

  public cards: any[] = [
    {
      title: 'Consolidado',
      icon: 'account_balance',
      value: 0,
      type: 'consolidado',
      percent: 0,
    },
    {
      title: 'Credito',
      icon: 'account_balance',
      value: 0,
      type: 'incoming',
      percent: 0,
    },
    {
      title: 'Debito',
      icon: 'account_balance',
      value: 0,
      type: 'outcoming',
      percent: 0,
    },
  ];
  public menuList: any[] = [
    {
      link: '/',
      name: 'Home',
      icon: 'home',
    },
    {
      link: '/dashboard',
      name: 'Dashboard',
      icon: 'dashboard',
    },
    {
      link: '/dashboard/registers',
      name: 'Registros',
      icon: 'create',
    },
    {
      link: '/dashboard/settings',
      name: 'Configurações',
      icon: 'settings',
    },
  ];
  public isActive = '';
  public isMobile: boolean;

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog,
    private breakpoint: BreakpointObserver,
    private loginService: LoginService
  ) {
    this.breakpoint
      ?.observe([Breakpoints.Small, Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
  }

  ngOnInit(): void {
    this.initialize();
  }

  private async initialize() {
    await this.fetchAutocomplete();
  }

  public goTo(payload: any): void {
    if (payload.name === 'Home') {
      this.store.dispatch(actionsApp.RESET_ALL());
    }
    if (this.router.url === payload.link) {
      this.send.emit('hide');
    } else if (this.isMobile) {
      this.send.emit('hide');
    }
    this.router.navigateByUrl(payload.link);
  }

  public logout(): void {
    this.dialog
      .open(DialogConfirmComponent, {
        data: { type: 'logout' },
        panelClass: 'dialog-default',
      })
      .afterClosed()
      .subscribe((res) => (res ? this.resetSession() : undefined));
  }

  public returnColor(name: string): string {
    // if (name === 'logout') {
    //   // return '#FF4081';
    //   return 'rgb(124, 181, 236)';
    // } else if (name === 'Registros') {
    //   // return 'rgb(247, 163, 92)';
    //   return 'rgb(124, 181, 236)';
    // } else if (name === 'Configurações') {
    //   return 'rgb(124, 181, 236)';
    // } else if (name === 'Home') {
    //   // return '#EEE';
    //   return 'rgb(124, 181, 236)';
    // } else if (name === 'Dashboard') {
    //   // return '#0ff5e6';
    //   return 'rgb(124, 181, 236)';
    // }
    // return 'inset';
    return '#0ff5e6';
  }

  public search(event: Event): void {
    event.stopPropagation();
    this.dialog.open(DialogsComponent, {
      data: { type: 'search', data: {} },
      panelClass: 'dialog-default',
    });
    if (this.isMobile) {
      this.send.emit('hide');
    }
  }

  public closeSidePanel(event: Event): void {
    event.stopPropagation();
    this.send.emit('hide');
  }

  private fetchAutocomplete(): Promise<any> {
    return new Promise((resolve) =>
      resolve(this.store.dispatch(actionsDashboard.FETCH_AUTOCOMPLETE()))
    );
  }

  private resetSession() {
    this.loginService.sessionIsOver('Sessão encerrada.');
  }
}
