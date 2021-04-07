import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
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
    this.breakpoint
      ?.observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
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

    this.store
      .select(({ registers, dashboard }: any) =>
        this.abastractStates({ registers, dashboard })
      )
      .pipe(
        map((state) => this.mapToProps(state)),
        delay(3500)
      )
      .subscribe(() => {
        this.isMainLoading = false;
      });
  }

  private initializingMain(): Promise<boolean> {
    return new Promise((resolve) => {
      this.initMain().then(() => {
        this.initGraphEvolution().then(() => {
          this.initGraphEvolutionExpense().then(() => {
            this.initGraphEvolutionCategory().then(() => {
              this.dashboardService.fetchLastDate().subscribe((dt) => {
                this.minDate = new Date(dt.dt_start);
                resolve(true);
              });
            });
          });
        });
      });
    });
  }
  private initMain(): Promise<any> {
    return new Promise((resolve) =>
      resolve(this.store.dispatch(actionsDashboard.FETCH_DASHBOARD()))
    );
  }

  private initGraphEvolution(): Promise<any> {
    return new Promise((resolve) =>
      resolve(this.store.dispatch(actionsDashboard.FETCH_EVOLUCAO()))
    );
  }

  private initGraphEvolutionExpense(): Promise<any> {
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

  private abastractStates({ registers, dashboard }: any): object {
    return {
      consolidado: dashboard.consolidado,
      evolucao: dashboard.evolucao,
      evoucao_despesas: dashboard.evolucao_despesas,
      graph_category: dashboard.graph_category,
      // a_pagar: dashboard.consolidado.a_pagar,
      // a_receber: dashboard.consolidado.a_receber,
      // total_credit: dashboard.consolidado.total_credit,
      // total_debit: dashboard.consolidado.total_debit,
      dates: dashboard.dates,
      all: [...dashboard.registers],
      all_days_period: dashboard.all_days_period,
      total_geral: registers.total_geral,
      despesas: registers.total_despesas,
      receita: registers.total_receita,

      tab: registers.tab,
    };
  }

  private mapToProps(st: any): any {
    this.ELEMENT_DATA = st.all.splice(0, 7);
    this.total = st.total_geral;
    this.totalDespesa = st.total_debit;
    this.totalReceita = st.total_credit;
    this.filterByDays = st.all_days_period;

    this.dates = st.dates;
    this.CATEGORY_DATA = st.graph_category;
    this.EVOLUCAO_DATA = st.evolucao;
    this.EVOLUCAO_DESPESAS_DATA = st.evoucao_despesas;
    // this.percentConsolidado = st.consolidado.percentConsolidado
    // this.percentDebit = st.consolidado.percentDebit

    this.cards.forEach((value) => {
      switch (value.type) {
        case 'incoming':
          value.value = st.consolidado.total_credit || 0;
          value.percent = st.consolidado.percent_credit || 0;
          break;
        case 'outcoming':
          value.value = st.consolidado.total_debit || 0;
          value.percent = st.consolidado.percentDebit || 0;
          break;
        case 'consolidado':
          value.value = st.consolidado.total_consolidado || 0;
          value.percent = st.consolidado.percentConsolidado;
          break;
      }
    });

    return st;
  }

  public onTabChange(event: MatTabChangeEvent): void {
    this.tabChanged = event.index;
  }

  public onDatesListening(event: any): void {
    switch (event.type) {
      case event.type:
        this.store.dispatch(
          actionsDashboard.FETCH_DATES({
            payload: {
              ...this.dates,
              type: event.type,
              [`${event.type}`]: event[event.type],
            },
          })
        );
        this.store.dispatch(event.action());
        break;
    }
  }
}
