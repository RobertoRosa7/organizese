import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  DoCheck,
  KeyValueDiffers,
  OnInit,
  RendererFactory2,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActionsSubject, Store } from '@ngrx/store';
import { fromEvent, Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { DialogFormIncomingComponent } from 'src/app/components/dialog-form-incoming/dialog-form-incoming.component';
import { Register } from 'src/app/models/models';
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
  public logo = './assets/icon-default-transparent-512x512.svg';
  public searchTerms: FormControl = new FormControl();
  public consolidado = 0;
  public isMobile = false;
  public json: any;
  public scroll: number;
  public buttonToTop: boolean;
  public type: string;
  public value: number;
  public showErrors = false;
  public isActive = '';
  public differ: any;
  public autocomplete: string[] = [];
  public autocomplete$: Observable<string[]>;
  public user: any;
  public isLoadingDashboard = true;
  private timeDelay = 1500;
  public hideValues: boolean;
  public isDark: boolean;
  public renderer: any;
  private previousScroll = 0;
  public hide = true;

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
      ?.observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
    this.store?.dispatch(actionsRegister.GET_TAB({ payload: 'read' }));
    this.differ = this.differs?.find({}).create();

    this.autocomplete$ = this.searchTerms.valueChanges.pipe(
      startWith(''),
      map((value) =>
        value ? this.filterAutocomplete(value) : this.autocomplete
      )
    );
  }

  public ngOnInit(): void {
    this.initialize();
    // this.scrollService?.getScrollAsStream().subscribe((currentScroll) => {
    //   if (currentScroll > this.previousScroll) {
    //     this.renderer.addClass(
    //       document.querySelector('.dashboard .sidebar'),
    //       'display-none'
    //     );
    //   } else {
    //     this.renderer.removeClass(
    //       document.querySelector('.dashboard .sidebar'),
    //       'display-none'
    //     );
    //   }
    //   this.previousScroll = currentScroll;
    // });
    fromEvent(window, 'keypress').subscribe((ev: any) => {
      if (ev.ctrlKey && ev.code === 'KeyB') {
        this.hide = !this.hide;
      }
    });

    this.store
      ?.select(({ http_error, dashboard, profile, app }: any) => ({
        http_error,
        consolidado: dashboard.consolidado,
        autocomplete: dashboard.auto_complete,
        theme: dashboard.dark_mode,
        profile: profile.user,
        hide_values: app.hide_values,
      }))
      .subscribe(async (state) => {
        this.logo = './assets/' + this.getTheme(state.theme);
        this.isDark = !(state.theme === 'dark-mode');
        this.hideValues = state.hide_values;
        this.autocomplete = state.autocomplete;
        this.user = state.profile;

        if (state.http_error.errors.length > 0) {
          this.handleError(state.http_error.errors[0]);
        }
      });

    this.as
      ?.pipe(filter((a) => a.type === actionsErrors.actionsTypes.SET_SUCCESS))
      .subscribe(({ payload }: any) => {
        const name: string = this.fetchNames(payload);
        this.snackbar?.open(`${name}`, 'Ok', { duration: 3000 });
      });
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

  private filterAutocomplete(value: string = ''): string[] {
    return this.autocomplete
      .filter((option) => option.toLowerCase().includes(value.toLowerCase()))
      .sort();
  }

  public isEmpty(payload: any): Promise<any> {
    return new Promise((resolve) => {
      if (!this.utilsService?.isEmpty(payload)) {
        resolve(payload);
      }
    });
  }

  private async initialize(): Promise<any> {
    this.fetchUser().then(() => {
      this.fetchRegisters().then(() => {
        this.initDashboard().then(() => {
          this.fetchAutocomplete().then(() => {
            this.isLoadingDashboard = false;
          });
        });
      });
    });
  }

  private async fetchUser(): Promise<any> {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(this.store?.dispatch(actionsProfile.GET_PROFILE())),
        this.timeDelay
      )
    );
  }

  private async initDashboard(): Promise<any> {
    return new Promise((resolve) =>
      setTimeout(
        () => resolve(this.store?.dispatch(actionsDashboard.INIT_DASHBOARD())),
        this.timeDelay
      )
    );
  }

  private async fetchRegisters(): Promise<any> {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(
            this.store?.dispatch(actionsRegister.INIT({ payload: { days: 7 } }))
          ),
        this.timeDelay
      )
    );
  }

  private async fetchAutocomplete(): Promise<any> {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(this.store?.dispatch(actionsDashboard.FETCH_AUTOCOMPLETE())),
        this.timeDelay
      )
    );
  }

  public onSubmit(): void {
    this.router?.navigate([
      'dashboard/result-search',
      { s: this.searchTerms.value },
    ]);
    this.searchTerms.reset();
  }

  public setSearch(event: MatAutocompleteSelectedEvent): void {
    this.router?.navigate([
      'dashboard/result-search',
      { s: event.option.value },
    ]);
    this.searchTerms.reset();
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

  public add(type: string): void {
    this.dialog
      ?.open(DialogFormIncomingComponent, {
        data: { type },
        panelClass: 'dialog-default',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const payload: Register = {
            category: res.category || 'Outros',
            created_at: res.created_at,
            updated_at: res.created_at,
            type: res.type,
            value: res.value,
            status: 'pending',
            brand: res.brand || '',
            edit: false,
            user: this.user,
            description: res.description?.trim() || 'Sem descrição',
          };
          this.store?.dispatch(actionsRegister.ADD_REGISTERS({ payload }));
        }
      });
  }

  public hideMenu(_: any): void {
    this.hide = !this.hide;
  }

  public returnSizePanel(): string {
    if (this.isMobile) {
      return this.hide ? '0' : '250px';
    } else {
      return this.hide ? '64px' : '250px';
    }
  }
}
