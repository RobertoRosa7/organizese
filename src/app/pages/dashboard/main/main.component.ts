import { AfterViewInit, Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Store } from '@ngrx/store'
import { Register } from 'src/app/models/models'
import { DashboardComponent } from '../dashboard.component'
import * as actionsDashboard from '../../../actions/dashboard.actions'
import { Router } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { delay, map, mergeMap } from 'rxjs/operators'
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout'
import { DashboardService } from 'src/app/services/dashboard.service'
import { Observable, of } from 'rxjs'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends DashboardComponent implements OnInit, DoCheck, AfterViewInit {
  public cards: any[] = [
    {
      title: 'Consolidado',
      icon: 'account_balance',
      value: 0,
      type: 'consolidado',
      percent: 0
    },
    {
      title: 'Credito',
      icon: 'account_balance',
      value: 0,
      type: 'incoming',
      percent: 0
    },
    {
      title: 'Debito',
      icon: 'account_balance',
      value: 0,
      type: 'outcoming',
      percent: 0
    }
  ]
  public ELEMENT_DATA: Register[] = []
  public EVOLUCAO_DATA: any = {}
  public EVOLUCAO_DESPESAS_DATA: any = {}
  public showEvolucaoReceita: boolean = false
  public showEvolucaoDespesa: boolean = false
  public aPagar: number = 0
  public aReceber: number = 0
  public totalPercent: number = 0
  public totalDespesa: number = 0
  public totalReceita: number = 0
  public total: number = 0
  public percent_consolidado: number = 0
  public percent_debit: number = 0
  public filterByDays: number = 0
  public differ: any
  public isMainLoading: boolean = true
  public CATEGORY_DATA: any = []

  constructor(
    protected _store: Store,
    protected _snackbar: MatSnackBar,
    protected _router: Router,
    protected _dialog: MatDialog,
    protected _differs: KeyValueDiffers,
    protected _breakpoint: BreakpointObserver,
    protected _dashboardService: DashboardService
  ) {
    super()
    this._breakpoint?.observe([Breakpoints.XSmall]).subscribe(result => this.isMobile = !!result.matches)
    this.differ = this._differs.find({}).create()
  }

  public ngDoCheck() {
    const change = this.differ.diff(this)
    if (change) {
      change.forEachChangedItem((item: any) => {
      })
    }
  }

  public async ngOnInit(): Promise<any> {
    await this.initializingMain()

    this._store.select(({ registers, dashboard }: any) => this.assignmentStates({ registers, dashboard }))
      .pipe(
        map((state) => this.mapToProps(state)),
        delay(3500),
      ).subscribe((st) => this.isMainLoading = false)
  }

  private initializingMain(): Promise<boolean> {
    return new Promise(resolve => {
      this.initGraphEvolution().then(() => {
        this.initGraphEvolutionExpense().then(() => {
          this.initGraphEvolutionCategory().then(() => {
            resolve(true)
          })
        })
      })
    })
  }

  private initGraphEvolution(): Promise<any> {
    return new Promise(resolve => resolve(this._store.dispatch(actionsDashboard.FETCH_EVOLUCAO())))
  }

  private initGraphEvolutionExpense(): Promise<any> {
    return new Promise(resolve => resolve(this._store.dispatch(actionsDashboard.FETCH_EVOLUCAO_DESPESAS())))
  }

  private initGraphEvolutionCategory(): Promise<any> {
    return new Promise(resolve => resolve(this._store.dispatch(actionsDashboard.FETCH_GRAPH_CATEGORY())))
  }

  public formatarValor(valor: number = 0): string {
    return new Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2 })
      .format(parseFloat(valor.toFixed(2)))
  }

  private assignmentStates({ registers, dashboard }: any) {
    return ({
      all: [...registers.all],
      consolidado: dashboard.consolidado,
      evolucao: dashboard.evolucao,
      evoucao_despesas: dashboard.evolucao_despesas,
      graph_category: dashboard.graph_category,
      tab: registers.tab,
      total_geral: registers.total_geral,
      despesas: registers.total_despesas,
      receita: registers.total_receita,
      a_pagar: dashboard.consolidado.a_pagar,
      a_receber: dashboard.consolidado.a_receber,
      total_credit: dashboard.consolidado.total_credit,
      total_debit: dashboard.consolidado.total_debit,
      all_days_period: registers.all_days_period,
    })
  }

  private mapToProps(state: any) {
    this.total = state.total_geral
    this.totalDespesa = state.total_debit
    this.totalReceita = state.total_credit
    this.aPagar = state.a_pagar
    this.aReceber = state.a_receber
    this.filterByDays = state.all_days_period
    this.CATEGORY_DATA = state.graph_category
    this.ELEMENT_DATA = state.all.splice(0, 7)
    this.EVOLUCAO_DATA = state.evolucao
    this.EVOLUCAO_DESPESAS_DATA = state.evoucao_despesas
    this.percent_consolidado = state.consolidado.percent_consolidado
    this.percent_debit = state.consolidado.percent_debit

    this.cards.forEach(value => {
      switch (value.type) {
        case 'incoming':
          value.value = state.consolidado.total_credit || 0
          value.percent = state.consolidado.percent_credit || 0
          break
        case 'outcoming':
          value.value = state.consolidado.total_debit || 0
          value.percent = state.consolidado.percent_debit || 0
          break
        case 'consolidado':
          value.value = state.consolidado.total_consolidado || 0
          value.percent = state.consolidado.percent_consolidado
          break
      }
    })

    return state
  }
}
