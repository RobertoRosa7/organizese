import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as actionsApp from '../../actions/app.actions';
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  @Input() public cols = '';
  @Input() public title = '';
  @Input() public color = '';
  @Input() public icon = '';
  @Input() public value = 0;
  @Input() public type = '';
  @Input() public item: any;
  @Input() public isLoading: boolean;

  public showValues = true;
  public isDark: boolean;
  public changeTextHide: string = this.showValues
    ? 'visibility'
    : 'visibility_off';

  constructor(private store: Store) {}

  public ngOnInit(): void {
    this.store
      .select(({ dashboard }: any) => ({
        theme: dashboard.dark_mode,
      }))
      .subscribe(async (state) => {
        this.isDark = !(state.theme === 'dark-mode');
      });
  }

  public returnClass(): string {
    if (this.value > 0 && this.item.type === 'incoming') {
      return 'cards-money cards-money-on';
    } else if (this.value > 0 && this.item.type === 'outcoming') {
      return 'cards-money cards-debit';
    } else if (this.value < 0) {
      return 'cards-money cards-money-off';
    } else {
      return 'cards-money';
    }
  }

  public returnColor(): string {
    if (this.item.type === 'outcoming') {
      return this.isDark ? '#e91e63' : '#FF4081';
    } else if (this.item.type === 'incoming') {
      return this.isDark ? '#009688' : '#0FF5E6';
    } else if (this.item.type === 'consolidado') {
      return this.isDark ? '#8e8e8e' : '#EEE';
    }
    return 'inset';
  }

  public formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(valor);
  }

  public formatarPercent(valor: number = 0): string {
    return valor.toFixed(2);
  }

  public hideShowValue(event: MouseEvent): void {
    event.stopPropagation();
    this.showValues = !this.showValues;
    this.changeTextHide =
      this.changeTextHide === 'visibility' ? 'visibility_off' : 'visibility';
    this.store.dispatch(actionsApp.HIDE_VALUES({ payload: this.showValues }));
  }
}
