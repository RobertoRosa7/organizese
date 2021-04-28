import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Register } from 'src/app/models/models';
import { DashboardService } from 'src/app/services/dashboard.service';
import * as actionsDashboard from '../../../actions/dashboard.actions';
import { DashboardComponent } from '../dashboard.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent
  extends DashboardComponent
  implements OnInit, DoCheck {
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
  public ELEMENT_DATA: Register[] = [];
  public EVOLUCAO_DATA: any = {};
  public EVOLUCAO_DESPESAS_DATA: any = {};
  public OUTCOME_AND_INCOME: any = {};
  public showEvolucaoReceita = false;
  public showEvolucaoDespesa = false;
  public aPagar = 0;
  public aReceber = 0;
  public totalPercent = 0;
  public totalDespesa = 0;
  public totalReceita = 0;
  public total = 0;
  public percentConsolidado = 0;
  public percentDebit = 0;
  public filterByDays = 0;
  public differ: any;
  public isMainLoading = true;
  public CATEGORY_DATA: any = [];
  public tabChanged: number;
  public dates: any;
  public dtStart: Date;
  public dtEnd: Date;
  public minDate: Date;
  public dashboard$: Observable<any>;
  public outcomeIncome$: Observable<any>;

  constructor(
    protected store: Store,
    protected snackbar: MatSnackBar,
    protected router: Router,
    protected dialog: MatDialog,
    protected differs: KeyValueDiffers,
    protected breakpoint: BreakpointObserver,
    protected dashboardService: DashboardService
  ) {
    super();
    const breakPoint = this.breakpoint?.observe([Breakpoints.XSmall]);

    breakPoint.subscribe((result) => (this.isMobile = !!result.matches));
    this.differ = this.differs.find({}).create();
  }

  public ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {});
    }
  }

  public async ngOnInit(): Promise<any> {
    await this.initializingMain();
    this.dashboard$ = this.store.select(({ dashboard }: any) => ({
      consolidado: this.cards.map((value: any) => {
        switch (value.type) {
          case 'incoming':
            value.value = dashboard.consolidado.total_credit || 0;
            value.percent = dashboard.consolidado.percent_credit || 0;
            break;
          case 'outcoming':
            value.value = dashboard.consolidado.total_debit || 0;
            value.percent = dashboard.consolidado.percent_debit || 0;
            break;
          case 'consolidado':
            value.value = dashboard.consolidado.total_consolidado || 0;
            value.percent = dashboard.consolidado.percent_consolidado;
            break;
        }
        return value;
      }),
      outcome_income: dashboard.outcome_income,
      all: dashboard.registers,
    }));
  }

  public onDatesChanges(event: any): void {
    this.store.dispatch(actionsDashboard.PUT_GRAPH_OUTCOME_INCOME());
  }

  private initializingMain(): Promise<boolean> {
    return new Promise(async (resolve) => {
      await this.initMain();
      await this.initGraphOutcomeIncome();
      setTimeout(() => resolve(true), 100);
    });
  }

  private initMain(): Promise<any> {
    return new Promise((resolve) =>
      resolve(this.store.dispatch(actionsDashboard.FETCH_DASHBOARD()))
    );
  }

  private initGraphOutcomeIncome(): Promise<any> {
    return new Promise((resolve) =>
      resolve(
        this.store.dispatch(actionsDashboard.FETCH_GRAPH_OUTCOME_INCOME())
      )
    );
  }

  private initGraphEvolutionIncome(): Promise<any> {
    return new Promise((resolve) =>
      resolve(this.store.dispatch(actionsDashboard.FETCH_EVOLUCAO()))
    );
  }

  private initGraphEvolutionOutcome(): Promise<any> {
    return new Promise((resolve) =>
      resolve(this.store.dispatch(actionsDashboard.FETCH_EVOLUCAO_DESPESAS()))
    );
  }

  private initGraphEvolutionCategory(): Promise<any> {
    return new Promise((resolve) =>
      resolve(this.store.dispatch(actionsDashboard.FETCH_GRAPH_CATEGORY()))
    );
  }

  public formatarValor(valor: number = 0): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(parseFloat(valor.toFixed(2)));
  }

  private abastractStates({ registers, dashboard }: any): any {
    return {
      // all: [...dashboard.registers],
      // consolidado: dashboard.consolidado,
      // evolucao: dashboard.evolucao,
      // evoucao_despesas: dashboard.evolucao_despesas,
      // graph_category: dashboard.graph_category,
      // a_pagar: dashboard.a_pagar,
      // a_receber: dashboard.a_receber,
      // total_credit: dashboard.total_credit,
      // total_debit: dashboard.total_debit,
      // despesas: dashboard.total_despesas,
      // receita: dashboard.total_receita,
      // all_days_period: dashboard.all_days_period,
      // total: dashboard.total,
      // tab: registers.tab,
    };
  }

  private mapToProps(st: any): any {
    // this.ELEMENT_DATA = st.all;
    // this.total = st.total;
    // this.totalDespesa = st.despesas;
    // this.totalReceita = st.receita;
    // this.filterByDays = st.all_days_period;
    // this.dates = st.dates;
    // this.CATEGORY_DATA = st.graph_category;
    // this.EVOLUCAO_DATA = st.evolucao;
    // this.EVOLUCAO_DESPESAS_DATA = st.evoucao_despesas;
    // this.percentConsolidado = st.consolidado.percent_consolidado;
    // this.percentDebit = st.consolidado.percent_debit;
    // this.OUTCOME_AND_INCOME.outcome = st.evoucao_despesas;
    // this.OUTCOME_AND_INCOME.income = st.evolucao;
    // this.cards.forEach((value) => {
    //   switch (value.type) {
    //     case 'incoming':
    //       value.value = st.consolidado.total_credit || 0;
    //       value.percent = st.consolidado.percent_credit || 0;
    //       break;
    //     case 'outcoming':
    //       value.value = st.consolidado.total_debit || 0;
    //       value.percent = st.consolidado.percent_debit || 0;
    //       break;
    //     case 'consolidado':
    //       value.value = st.consolidado.total_consolidado || 0;
    //       value.percent = st.consolidado.percent_consolidado;
    //       break;
    //   }
    // });
    // return st;
  }

  public onTabChange(event: MatTabChangeEvent): void {
    this.tabChanged = event.index;
  }

  // public onDatesListening(event: any): void {
  //   switch (event.type) {
  //     case event.type:
  //       this.store.dispatch(
  //         actionsDashboard.FETCH_DATES({
  //           payload: {
  //             ...this.dates,
  //             type: event.type,
  //             [`${event.type}`]: event[event.type],
  //           },
  //         })
  //       );
  //       this.initMain().then(() => this.store.dispatch(event.action()));
  //       break;
  //   }
  // }

  public returnColor(): string {
    return '#7d99ed';
  }
}
