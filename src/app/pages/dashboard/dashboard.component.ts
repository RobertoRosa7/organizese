import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  DoCheck,
  KeyValueDiffers,
  OnInit,
  RendererFactory2,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActionsSubject, Store } from '@ngrx/store';
import { fromEvent } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IpcService } from 'src/app/services/ipc.service';
import { LoadService } from 'src/app/services/load.service';
import { ScrollService } from 'src/app/services/scroll.service';
import { UtilsService } from 'src/app/utils/utis.service';
import * as actionsApp from '../../actions/app.actions';
import * as actionsDashboard from '../../actions/dashboard.actions';
import * as actionsErrors from '../../actions/errors.actions';
import * as actionsLogin from '../../actions/login.actions';
import * as actionsProfile from '../../actions/profile.actions';
import * as actionsRegister from '../../actions/registers.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, DoCheck {
  public logo = './assets/icon-default-transparent-512x512.svg';
  public consolidado = 0;
  public isMobile = false;
  public json: any;
  public scroll: number;
  public type: string;
  public value: number;
  public showErrors = false;
  public isActive = '';
  public differ: any;
  public user: any;
  public isLoadingDashboard = true;
  public hideValues: boolean;
  public isDark: boolean;
  public renderer: any;
  public hide = false;

  constructor(
    protected ipcService?: IpcService,
    protected store?: Store,
    protected snackbar?: MatSnackBar,
    protected as?: ActionsSubject,
    protected breakpoint?: BreakpointObserver,
    protected scrollService?: ScrollService,
    protected router?: Router,
    protected differs?: KeyValueDiffers,
    protected dialog?: MatDialog,
    protected loadService?: LoadService,
    protected utilsService?: UtilsService,
    protected rendereFactory?: RendererFactory2
  ) {
    this.renderer = this.rendereFactory?.createRenderer(null, null);
    this.router?.events.subscribe((u: any) => (this.isActive = u.url));
    this.breakpoint
      ?.observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => (this.isMobile = !!result.matches));
    this.store?.dispatch(actionsRegister.GET_TAB({ payload: 'read' }));
    this.differ = this.differs?.find({}).create();
  }

  public ngOnInit(): void {
    this.initialize();
    this.toggleSidebar();
    this.hideBackdrop();
    this.onStore();
    this.onSuccess();
  }

  public ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'isActive') {
          this.store?.dispatch(actionsRegister.GET_TAB({ payload: 'read' }));
        }
      });
    }
  }

  public isEmpty(payload: any): Promise<any> {
    return new Promise((resolve) => {
      if (!this.utilsService?.isEmpty(payload)) {
        resolve(payload);
      }
    });
  }

  private onSuccess(): void {
    this.as
      ?.pipe(filter((a) => a.type === actionsErrors.actionsTypes.SET_SUCCESS))
      .subscribe(({ payload }: any) => {
        const name: string = this.fetchNames(payload);
        this.snackbar?.open(`${name}`, 'Ok', { duration: 3000 });
      });
  }

  private onStore(): void {
    this.store
      ?.select(({ http_error, dashboard, profile }: any) => ({
        http_error,
        theme: dashboard.dark_mode,
        profile: profile.user,
      }))
      .subscribe(async (state) => {
        this.logo = './assets/' + this.getTheme(state.theme);
        this.isDark = state.theme !== 'dark-mode';
        this.user = state.profile;
      });
  }

  private async initialize(): Promise<any> {
    await this.fetchUser();
    await this.fetchRegisters();
    await this.initDashboard();
  }

  private async fetchUser(): Promise<any> {
    return new Promise((resolve) =>
      resolve(this.store?.dispatch(actionsProfile.GET_PROFILE()))
    );
  }

  private async initDashboard(): Promise<any> {
    return new Promise((resolve) =>
      resolve(this.store?.dispatch(actionsDashboard.INIT_DASHBOARD()))
    );
  }

  private async fetchRegisters(): Promise<any> {
    return new Promise((resolve) =>
      resolve(
        this.store?.dispatch(actionsRegister.INIT({ payload: { days: 7 } }))
      )
    );
  }

  public handleError(error: any): void {
    this.showErrors = true;
    const name: string = this.fetchNames(error.source);
    this.notification(`Error: ${name} code: ${error.status}`);
  }

  public formatarValor(valor: number = 0): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(parseFloat(valor.toFixed(2)));
  }

  private fetchNames(name: string): string {
    switch (name) {
      case 'fetch_registers':
        return 'Registros carregados';
      case 'update_register':
        return 'Registro atualizado';
      case 'delete_register':
        return 'Registro excluído';
      case 'new_register':
        return 'Novo registro';
      case 'status_code':
        return 'Status code: ';
      case 'fetch_evolucao_detail':
        return 'ao carregar gráfico';
      case 'signin':
        return 'Login';
      case 'login':
        return 'Login sucesso';
      default:
        return '';
    }
  }

  public returnClass(): string {
    if (this.consolidado > 0) {
      return 'cards-money cards-money-on';
    } else if (this.consolidado > 0 && this.type === 'outcoming') {
      return 'cards-money cards-debit';
    } else if (this.consolidado < 0) {
      return 'cards-money cards-money-off';
    } else {
      return 'cards-money';
    }
  }

  public notification(str: string, time: number = 3000): void {
    this.snackbar?.open(str, 'ok', { duration: time });
  }

  public openDialog(component: any, data: MatDialogConfig = {}): any {
    const settings: MatDialogConfig = { ...data, panelClass: 'dialog-default' };
    return this.dialog?.open(component, settings);
  }

  public cleanText(text: string | undefined = ''): string {
    return text
      .toLowerCase()
      .replace(' ', '_')
      .replace('&', 'e')
      .replace('á', 'a')
      .replace('ã', 'a')
      .replace('ç', 'c')
      .replace('õ', 'o');
  }

  public logout(): void {
    this.router?.navigateByUrl('/');
    this.store?.dispatch(actionsLogin.LOGOUT());
  }

  public getTheme(theme: string): string {
    return theme === 'dark-mode'
      ? 'icon-default-dark-512x512.svg'
      : 'icon-default-stroke-512x512.svg';
  }

  public goTo(action: any): void {
    if (action.name === 'Home') {
      this.store?.dispatch(actionsApp.RESET_ALL());
    }
  }

  public hideMenu(_: any): void {
    this.hide = !this.hide;
  }

  private hideBackdrop(): void {
    fromEvent(document, 'click').subscribe((ev) => {
      const backdrop = document.querySelector('.dashboard-container.backdrop');
      if (backdrop === ev.target) {
        this.hide = !this.hide;
      }
    });
  }

  private toggleSidebar(): void {
    fromEvent(window, 'keypress').subscribe((ev: any) => {
      if (ev.ctrlKey && ev.code === 'KeyB') {
        this.hide = !this.hide;
      }
    });
  }
}
