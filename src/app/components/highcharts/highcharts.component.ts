import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  KeyValueDiffers,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { Store } from '@ngrx/store';
import * as Highcharts from 'highcharts';
import * as moment from 'moment';
import { UtilsService } from 'src/app/utils/utis.service';
import * as actionsDashboard from '../../actions/dashboard.actions';

const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);
noData(Highcharts);

const MY_FORMATS = {
  parse: { dateInput: 'DD MM YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-highcharts',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class HighchartsComponent implements OnInit, DoCheck {
  @ViewChild('highchartEvoution', { static: true })
  highchartEvoution: ElementRef;
  @ViewChild('highchartPie', { static: true }) highchartPie: ElementRef;

  @Input() public evolucao: any;
  @Input() public category: any[] = [];
  @Input() public operation: string;
  @Input() public dtStart: Date;
  @Input() public dtEnd: Date;
  @Input() public tabChanged: number;
  @Input() public minDate: Date = new Date('1920-01-01');
  @Output() public onDates: EventEmitter<any> = new EventEmitter();

  public chartLine: any = {
    chart: {
      type: 'column',
      height: 400,
      spacingTop: 50,
    },
    navigator: { enabled: false },
    scrollbar: { enabled: false },
    rangeSelector: { enabled: false },
    title: { text: '' },
    subtitle: { text: '' },
    credits: { enabled: false },
    legend: {
      enabled: true,
      itemStyle: {
        color: '',
      },
    },
    yAxis: {
      gridLineDashStyle: 'longdash',
      title: { text: '' },
      opposite: false,
      labels: {
        formatter(): any {
          const self: any = this;
          let str = '';
          if (self.value > 0) {
            str += `R$ ${Intl.NumberFormat('pt-BR', {
              currency: 'BRL',
              minimumFractionDigits: 2,
            }).format(self.value.toFixed(2))}`;
          }
          return str;
        },
        style: {
          color: '',
        },
      },
    },
    xAxis: {
      tickInterval: 10,
      categories: [],
      crosshair: true,
      labels: {
        // tslint:disable-next-line: object-literal-shorthand
        formatter: function (): any {
          const self: any = this;
          return Highcharts.dateFormat('%m/%Y', self.value * 1000);
        },
        style: {
          color: '',
        },
      },
    },
    tooltip: {
      borderWidth: 0,
      borderRadius: 8,
      shadow: true,
      padding: 10,
      zIndex: 1,
      useHTML: true,
      shared: true,
      crosshairs: true,
      // tslint:disable-next-line: object-literal-shorthand
      formatter: function (): any {
        const self: any = this;
        let s = `
            <div class="highchart-tooltip">
              <strong>${Highcharts.dateFormat(
                '%d/%m/%Y',
                self.x * 1000
              )}</strong>
            </div>
          `;
        for (const i in self.points) {
          if (self.points[i].y > 0) {
            s += `<span style="color:${self.points[i].series.color}">●</span>
              <span class="highchart-text">${
                self.points[i].series.name
              }: </span>
              <b class="highchart-text">
              R$ ${Intl.NumberFormat('pt-BR', {
                currency: 'BRL',
                minimumFractionDigits: 2,
              }).format(self.points[i].y.toFixed(2))}</b>
            <br/>
          `;
          }
        }
        return s;
      },
    },
    plotOptions: {
      series: {
        pointPadding: 0,
      },
      column: {
        pointPadding: 0,
        borderWidth: 0,
        pointWidth: 20,
      },
    },
    series: [],
  };

  public chartPie: any = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
      spacingTop: 30,
    },
    title: {
      text: '',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: '',
      },
    },
    credits: { enabled: false },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    series: [{ name: 'Despesa', colorByPoint: true, data: [] }],
  };

  public data: any = {};
  public differ: any;
  public enableButtonFilter = true;
  public isMobile: boolean;
  public setDtStart: any;
  public setDtEnd: any;

  constructor(
    private store: Store,
    private differs: KeyValueDiffers,
    private breakpoint: BreakpointObserver,
    private utilsService: UtilsService
  ) {
    this.breakpoint
      ?.observe([Breakpoints.XSmall])
      // tslint:disable-next-line: deprecation
      .subscribe((result) => (this.isMobile = !!result.matches));
    this.differ = this.differs.find({}).create();
  }

  public ngOnInit(): void {
    this.store
      .select(({ dashboard }: any) => this.abstractStates({ dashboard }))
      // tslint:disable-next-line: deprecation
      .subscribe((state) => {
        const theme =
          state.mode === 'light-mode'
            ? 'var(--color-medium-white)'
            : 'var(--color-default-dark)';
        const themeInverse =
          state.mode != 'light-mode'
            ? 'var(--color-medium-white)'
            : 'var(--color-default-dark)';

        this.chartLine.chart.backgroundColor = theme;
        this.chartLine.tooltip.backgroundColor = theme;
        this.chartLine.yAxis.gridLineColor = themeInverse;
        this.chartLine.yAxis.labels.style.color = themeInverse;
        this.chartLine.xAxis.labels.style.color = themeInverse;
        this.chartLine.legend.itemStyle.color = themeInverse;

        this.chartPie.chart.backgroundColor = theme;
        this.chartPie.legend.itemStyle.color = themeInverse;
      });
  }

  private abstractStates({ dashboard }: any): any {
    return {
      mode: dashboard.dark_mode,
      evolucao: dashboard.evolucao,
      dates: dashboard.dates,
    };
  }

  public ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'category') {
          this.instanceHighchart().then(() => {
            Highcharts.chart(this.highchartPie.nativeElement, this.chartPie);
          });
        }

        if (item.key === 'tabChanged') {
          if (this.tabChanged === 1 && this.operation === 'despesas') {
            this.instanceHighchart().then(() => {
              Highcharts.chart(
                this.highchartEvoution.nativeElement,
                this.chartLine
              );
            });
          }

          if (this.tabChanged === 2 && this.operation === 'receita') {
            this.instanceHighchart().then(() => {
              Highcharts.chart(
                this.highchartEvoution.nativeElement,
                this.chartLine
              );
            });
          }

          if (this.tabChanged === 0 && this.operation === 'categoria') {
            this.instanceHighchart().then(() => {
              Highcharts.chart(
                this.highchartPie.nativeElement,
                this.chartPie
              ).redraw();
            });
          }
        }
      });
    }
  }

  public instanceHighchart(): Promise<any> {
    return new Promise((resolve) => {
      switch (this.operation) {
        case 'despesas':
          this.setDataOnGraph();
          const outcome = this.evolucao.graph_evolution;
          !this.utilsService.isEmpty(outcome) && outcome.dates.length > 0
            ? this.setDatesAndEnableButton()
            : this.resetDatesAndEnableButton();
          break;
        case 'receita':
          this.setDataOnGraph();
          const income = this.evolucao.graph_evolution;
          !this.utilsService.isEmpty(income) && income.dates.length > 0
            ? this.setDatesAndEnableButton()
            : this.resetDatesAndEnableButton();
          break;
        case 'categoria':
          this.chartPie.series[0].data = this.category.map((v: any) => ({
            name: v.name,
            y: v.y,
            sliced: v.sliced,
          }));
          this.category.length > 0
            ? this.setDatesAndEnableButton()
            : this.resetDatesAndEnableButton();
          break;
      }
      resolve(true);
    });
  }

  private setDataOnGraph(): void {
    const values: any = [];
    if (this.evolucao.graph_evolution) {
      for (const i in this.evolucao.graph_evolution) {
        if (i !== 'dates') {
          values.push({
            name: this.evolucao.graph_evolution[i].label,
            data: this.evolucao.graph_evolution[i].values,
          });
        }
      }
      this.chartLine.series = values;
      this.chartLine.xAxis.categories = this.evolucao.graph_evolution.dates;
    }
  }

  public filterEnd = (d: any): boolean => {
    return moment(d).isSameOrAfter(moment(new Date()));
    // tslint:disable-next-line: semicolon
  };

  public filterStart = (d: any): boolean => {
    return moment(d).isSameOrBefore(moment(new Date()));
    // tslint:disable-next-line: semicolon
  };

  public onSubmit(): void {
    const tab: number = this.tabChanged ? this.tabChanged : 0;
    const payload: any = {};
    switch (tab) {
      case 0:
        payload.category = {
          dt_end: moment(this.setDtEnd),
          dt_start: moment(this.setDtStart),
        };
        payload.type = 'category';
        payload.action = actionsDashboard.FETCH_GRAPH_CATEGORY;
        break;
      case 1:
        payload.outcome = {
          dt_end: moment(this.setDtEnd),
          dt_start: moment(this.setDtStart),
        };
        payload.type = 'outcome';
        payload.action = actionsDashboard.FETCH_EVOLUCAO_DESPESAS;
        break;
      case 2:
        payload.income = {
          dt_end: moment(this.setDtEnd),
          dt_start: moment(this.setDtStart),
        };
        payload.type = 'income';
        payload.action = actionsDashboard.FETCH_EVOLUCAO;
        break;
    }
    this.onDates.emit(payload);
  }

  private setDatesAndEnableButton(): void {
    this.setDtEnd = this.dtEnd;
    this.setDtStart = this.dtStart;
    this.enableButtonFilter = false;
  }

  private resetDatesAndEnableButton(): void {
    this.setDtEnd = undefined;
    this.setDtStart = undefined;
    this.enableButtonFilter = true;
  }
}
