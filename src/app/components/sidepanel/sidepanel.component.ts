import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-sidepanel',
  templateUrl: './sidepanel.component.html',
  styleUrls: ['./sidepanel.component.scss'],
})
export class SidepanelComponent implements OnInit {
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
  constructor(protected store: Store) {}

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
}
