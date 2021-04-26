import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as actionsApp from '../../actions/app.actions';
import * as actionsLogin from '../../actions/login.actions';

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
    protected breakpoint: BreakpointObserver
  ) {
    this.breakpoint
      ?.observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
  }

  ngOnInit(): void {
    this.store
      .select(({ dashboard }: any) => ({
        consolidado: dashboard.consolidado,
      }))
      .subscribe(async (state) => {
        this.cards.forEach((value) => {
          switch (value.type) {
            case 'incoming':
              value.value = state.consolidado.total_credit || 0;
              value.percent = state.consolidado.percent_credit || 0;
              break;
            case 'outcoming':
              value.value = state.consolidado.total_debit || 0;
              value.percent = state.consolidado.percent_debit || 0;
              break;
            case 'consolidado':
              value.value = state.consolidado.total_consolidado || 0;
              value.percent = state.consolidado.percent_consolidado;
              break;
          }
        });
      });
  }

  public returnClass(value: number, type: string): string {
    if (value > 0 && type === 'incoming') {
      return 'cards-money cards-money-on';
    } else if (value > 0 && type === 'outcoming') {
      return 'cards-money cards-debit';
    } else if (value < 0) {
      return 'cards-money cards-money-off';
    } else {
      return 'cards-money';
    }
  }

  public formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(valor);
  }

  public returnFormatterType(type: string): string {
    switch (type) {
      case 'incoming':
        return 'Entrada';
      case 'outcoming':
        return 'Saída';
      case 'consolidado':
        return 'Consolidado';
      default:
        return '';
    }
  }

  public goTo(action: any): void {
    if (action.name === 'Home') {
      this.store?.dispatch(actionsApp.RESET_ALL());
    }
    this.send.emit('hide');
  }

  public logout(): void {
    this.router?.navigateByUrl('/');
    this.store.dispatch(actionsLogin.LOGOUT());
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
    this.send.emit('hide');
  }

  public closeSidePanel(event: Event): void {
    event.stopPropagation();
    this.send.emit('hide');
  }
}
