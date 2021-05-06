import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, DoCheck, KeyValueDiffers, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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
    this.breakpoint
      ?.observe([Breakpoints.XSmall, Breakpoints.Small])
      .subscribe((result) => {
        this.isMobile = !!result.matches;
      });
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
      lastdate: dashboard.lastdate_outcome.dt_start,
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
      await this.initGraphLastOutcome();
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

  private initGraphLastOutcome(): Promise<any> {
    return new Promise((resolve) =>
      resolve(this.store.dispatch(actionsDashboard.FETCH_LASTDATE_OUTCOME()))
    );
  }

  public formatarValor(valor: number = 0): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(parseFloat(valor.toFixed(2)));
  }

  public returnColor(): string {
    return '#7d99ed';
  }
}
