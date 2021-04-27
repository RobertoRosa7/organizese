import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Input,
  KeyValueDiffers,
  OnChanges,
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
import { delay, map } from 'rxjs/operators';
import { ChartService } from 'src/app/services/highcharts.service';
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

export function teste(): any {}
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
export class HighchartsComponent implements OnInit, DoCheck, OnChanges {
  @ViewChild('highchartEvoution', { static: true })
  highchartEvoution: ElementRef;
  @ViewChild('highchartPie', { static: true }) highchartPie: ElementRef;
  @ViewChild('highchartLine', { static: true }) highchartLine: ElementRef;

  @Input() public evolucao: any;
  @Input() public category: any[] = [];
  @Input() public operation: string;
  @Input() public dtStart: Date;
  @Input() public dtEnd: Date;
  @Input() public tabChanged: number;
  @Input() public minDate: Date = new Date('1920-01-01');
  @Input() public type: string;

  @Output() public send = new EventEmitter();

  public chartLine: any = {
    chart: {
      type: 'column',
      height: 350,
      spacingTop: 20,
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
        formatter(): any {
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
      formatter(): any {
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
      spacingTop: 20,
      height: 350,
    },
    title: {
      text: '',
    },
    tooltip: {
      // tslint:disable-next-line: object-literal-shorthand
      formatter(): any {
        const self: any = this;
        return `
          <small>${self.key}: <b>${self.percentage.toFixed(2)}%</b></small>
          <br>
          <small>Total: <b>R$ ${Intl.NumberFormat('pt-BR', {
            currency: 'BRL',
            minimumFractionDigits: 2,
          }).format(self.point.options.total.toFixed(2))}</b>
          </small>
        </div>
        `;
      },
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
  public color: string;
  private theme: string;
  private themeInverse: string;
  private outcomeIncome: any = { in: {}, out: {} };

  constructor(
    private store: Store,
    private differs: KeyValueDiffers,
    private breakpoint: BreakpointObserver,
    private chartService: ChartService
  ) {
    this.breakpoint
      ?.observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
    this.differ = this.differs.find({}).create();
  }

  public ngOnInit(): void {
    this.store
      .select(({ dashboard }: any) => this.abstractStates({ dashboard }))
      .pipe(
        map((states) => this.mapToProps(states)),
        delay(3500)
      )
      .subscribe(() => {});

    setTimeout(() => {
      if (this.operation === 'outcome_income') {
        this.chartService.getCharts().subscribe((chart) => {
          const values: any = [];
          const despesas: any = [];

          chart.chart.type = this.type;
          chart.backgroundColor = this.theme;
          chart.tooltip.backgroundColor = this.theme;

          for (const i in this.outcomeIncome.in.graph_evolution) {
            if (i !== 'dates') {
              values.push({
                name: 'Receita',
                data: this.outcomeIncome.in.graph_evolution[i].values,
              });
            }
          }

          for (const i in this.outcomeIncome.out.graph_evolution) {
            if (i !== 'dates') {
              despesas.push({
                name: 'Despesas',
                data: this.outcomeIncome.out.graph_evolution[i].values,
              });
            }
          }

          const t = values.map((val: any) => {
            let total = 0;
            const data = [
              Math.max.apply(
                Math,
                val.data.map((v: number) => (total = total + v))
              ),
            ];
            return {
              ...val,
              data,
            };
          });

          const d = despesas.map((val: any) => {
            let total = 0;
            const data = [
              Math.max.apply(
                Math,
                val.data.map((v: number) => (total = total + v))
              ),
            ];
            return {
              ...val,
              data,
            };
          });

          const series = [
            {
              name: 'Receita',
              data: t.map((v: any) => v.data[0]),
              color: 'rgb(144, 237, 125)',
            },
            {
              name: 'Despesas',
              data: d.map((v: any) => v.data[0]),
              color: '#FF4081',
            },
          ];
          chart.series = series;
          chart.xAxis.categories = this.outcomeIncome.in.graph_evolution.dates;
          Highcharts.chart(this.highchartLine.nativeElement, chart);
        });
      }
    }, 200);
  }

  public ngOnChanges(): void {}

  public ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'category') {
          this.instanceHighchart().then(() => {
            const instanceCategory = Highcharts.chart(
              this.highchartPie.nativeElement,
              this.chartPie
            );
            this.color = this.getColorFromMaxValue({
              type: 'category',
              instanceCategory,
            });
          });
        }

        if (item.key === 'evolucao') {
          if (this.operation === 'despesas') {
            this.instanceHighchart().then(() => {
              const instanceDespesas = Highcharts.chart(
                this.highchartEvoution.nativeElement,
                this.chartLine
              );
              this.color = this.getColorFromMaxValue({
                type: 'despesas',
                instanceDespesas,
              });
            });
          }

          if (this.operation === 'receita') {
            this.instanceHighchart().then(() => {
              const instanceReceita = Highcharts.chart(
                this.highchartEvoution.nativeElement,
                this.chartLine
              );
              this.color = this.getColorFromMaxValue({
                type: 'receita',
                instanceReceita,
              });
            });
          }

          if (this.operation === 'categoria') {
            this.instanceHighchart().then(() => {
              const instanceCategory = Highcharts.chart(
                this.highchartPie.nativeElement,
                this.chartPie
              ).redraw();
              this.color = this.getColorFromMaxValue({
                type: 'category',
                instanceCategory,
              });
            });
          }
        }
      });
    }
  }

  private mapToProps(states: any): any {
    if (states.mode) {
      this.theme = 'var(--white-one)';
      this.themeInverse = 'var(--color-dark-secondary)';
    } else {
      this.theme = 'var(--color-dark-secondary)';
      this.themeInverse = 'var(--white-one)';
    }
    this.chartLine.chart.backgroundColor = this.theme;
    this.chartLine.tooltip.backgroundColor = this.theme;
    this.chartLine.yAxis.gridLineColor = this.themeInverse;
    this.chartLine.yAxis.labels.style.color = this.themeInverse;
    this.chartLine.xAxis.labels.style.color = this.themeInverse;
    this.chartLine.legend.itemStyle.color = this.themeInverse;
    this.chartPie.chart.backgroundColor = this.theme;
    this.chartPie.legend.itemStyle.color = this.themeInverse;
    this.outcomeIncome.out = states.evoucao_despesas;
    this.outcomeIncome.in = states.evolucao;
    return states;
  }

  private abstractStates({ dashboard }: any): any {
    return {
      mode: dashboard.dark_mode,
      evolucao: dashboard.evolucao,
      dates: dashboard.dates,
      evoucao_despesas: dashboard.evolucao_despesas,
    };
  }

  public getColorFromMaxValue(payload: any): string {
    switch (payload.type) {
      case 'category':
        const categories: any = [];
        payload.instanceCategory.series[0].data.forEach((value: any) =>
          categories.push(value.y)
        );
        const category =
          payload.instanceCategory.series[0].data[
            categories.indexOf(Math.max.apply(Math, categories))
          ];
        return category ? category.color : 'inset';
      case 'despesas':
        const despesas: any = [];
        payload.instanceDespesas.series.forEach((value: any) =>
          despesas.push(value.dataMax)
        );
        const despesa =
          payload.instanceDespesas.series[
            despesas.indexOf(Math.max.apply(Math, despesas))
          ];
        return despesa ? despesa.color : 'inset';
      case 'receita':
        const receitas: any = [];
        payload.instanceReceita.series.forEach((value: any) =>
          receitas.push(value.dataMax)
        );
        const receita =
          payload.instanceReceita.series[
            receitas.indexOf(Math.max.apply(Math, receitas))
          ];
        return receita ? receita.color : 'inset';
      default:
        return 'inset';
    }
  }

  public instanceHighchart(): Promise<any> {
    return new Promise((resolve) => {
      switch (this.operation) {
        case 'despesas':
          this.setDataOnGraph();
          this.setDatesAndEnableButton();
          break;
        case 'receita':
          this.setDataOnGraph();
          this.setDatesAndEnableButton();
          break;
        case 'categoria':
          this.chartPie.series[0].data = this.category.map((v: any) => ({
            name: v.name,
            y: v.y,
            total: v.total,
            sliced: v.sliced,
          }));
          this.setDatesAndEnableButton();
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
  };

  public filterStart = (d: any): boolean => {
    return moment(d).isSameOrBefore(moment(new Date()));
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
    this.send.emit(payload);
  }

  private setDatesAndEnableButton(): void {
    this.setDtEnd = this.dtEnd;
    this.setDtStart = this.dtStart;
  }

  // private resetDatesAndEnableButton(): void {
  //   this.setDtEnd = undefined;
  //   this.setDtStart = undefined;
  //   this.enableButtonFilter = true;
  // }
}
