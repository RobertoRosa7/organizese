import { Component, Input, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import * as actionsApp from '../../actions/app.actions'
@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class CardsComponent implements OnInit {
  @Input('cols') public cols: string = ''
  @Input('title') public title: string = ''
  @Input('color') public color: string = ''
  @Input('icon') public icon: string = ''
  @Input('value') public value: number = 0
  @Input('type') public type: string = ''
  @Input('item') public item: any
  @Input('isLoading') public isLoading: boolean

  public showValues: boolean = true
  public changeTextHide: string = this.showValues ? 'visibility' : 'visibility_off'

  constructor(
    private _store: Store
  ) { }

  public ngOnInit(): void {
 
  }

  public returnClass(): string {
    if (this.value > 0 && this.item.type === 'incoming') {
      return 'cards-money cards-money-on'
    } else if (this.value > 0 && this.item.type === 'outcoming') {
      return 'cards-money cards-debit'
    } else if (this.value < 0) {
      return 'cards-money cards-money-off'
    } else {
      return 'cards-money'
    }
  }

  public formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2 }).format(valor)
  }

  public formatarPercent(valor: number): string {
    return valor.toFixed(2)
  }

  public hideShowValue(event: MouseEvent) {
    event.stopPropagation()
    this.showValues = !this.showValues
    this.changeTextHide = this.changeTextHide === 'visibility' ? 'visibility_off' : 'visibility'
    this._store.dispatch(actionsApp.HIDE_VALUES({ payload: this.showValues }))
  }

}
