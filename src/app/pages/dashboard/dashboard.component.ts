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
import { fromEvent, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard.service';
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
    protected rendereFactory?: RendererFactory2,
    protected dashboardService?: DashboardService
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

    this.fetchLastRegister().subscribe(({ data: payload }) =>
      this.store?.dispatch(actionsDashboard.SET_NOTIFICATION_LIST({ payload }))
    );
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

  public updateRegisters(event: any): void {
    this.dispatchActions();
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

  private async initialize(): Promise<any> {
    await this.fetchUser();
    await this.fetchRegisters();
    await this.initDashboard();
  }

  private getLastRegister(list: any[]): number {
    return list.length > 0
      ? [...list].sort((a: any, b: any) => {
          if (a.created_at > b.created_at) {
            return -1;
          } else if (a.created_at < b.created_at) {
            return 1;
          }
          return 0;
        })[0].created_at
      : new Date().getTime();
  }

  private async fetchUser(): Promise<any> {
    return Promise.resolve(this.store?.dispatch(actionsProfile.GET_PROFILE()));
  }

  private async initDashboard(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsDashboard.INIT_DASHBOARD())
    );
  }

  private async fetchRegisters(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsRegister.INIT({ payload: { days: 7 } }))
    );
  }

  private onSuccess(): void {
    this.onActionsTypes(actionsErrors.actionsTypes.SET_SUCCESS).subscribe(
      ({ payload }: any) => {
        const name: string = this.fetchNames(payload);
        this.snackbar?.open(`${name}`, 'Ok', { duration: 3000 });
      }
    );
  }

  private onStore(): void {
    this.store
      ?.select(({ dashboard, profile }: any) => ({
        theme: dashboard.dark_mode,
        profile: profile.user,
        registers: [...dashboard.registers],
      }))
      .subscribe(async (state) => {
        this.logo = './assets/' + this.getTheme(state.theme);
        this.isDark = state.theme !== 'dark-mode';
        this.user = state.profile;
      });
  }

  private fetchLastRegister(): Observable<any> {
    return this.onActionsTypes(
      actionsDashboard.actionsTypes.SET_DASHBOARD
    ).pipe(
      map(({ payload }) => (payload ? [...payload.data.results] : [])),
      mergeMap((list) => {
        if (this.dashboardService) {
          return this.dashboardService?.fetchAllLastRegisters({
            last_date: this.getLastRegister(list),
          });
        } else {
          return of(null);
        }
      })
    );
  }

  private async dispatchActions(payload?: any): Promise<any> {
    await this.putDashboard();
    await this.putConsolidado();
    await this.putGraphOutcomeIncome();
    await this.putLastDateOutcome();
    await this.putAutocomplete();
    this.snackbar?.open('Registros atualizados.', 'ok', {
      duration: 3000,
    });
  }

  private putDashboard(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsDashboard.PUT_DASHBOARD())
    );
  }

  private putConsolidado(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsDashboard.PUT_CONSOLIDADO())
    );
  }

  private putGraphOutcomeIncome(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsDashboard.PUT_GRAPH_OUTCOME_INCOME())
    );
  }

  private putLastDateOutcome(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsDashboard.PUT_LASTDATE_OUTCOME())
    );
  }

  private putAutocomplete(): Promise<any> {
    return Promise.resolve(
      this.store?.dispatch(actionsDashboard.UPDATE_AUTOCOMPLETE())
    );
  }

  private onActionsTypes(type: string): Observable<any> {
    return this.as ? this.as.pipe(filter((a) => a.type === type)) : of(null);
  }
}
