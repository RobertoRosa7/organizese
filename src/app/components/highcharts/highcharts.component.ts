import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
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
import { DashboardService } from 'src/app/services/dashboard.service';
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
  @Input() public data: any;
  @Input() public type: string;
  @Input() public minDate: Date = new Date('1920-01-01');
  @Output() public send = new EventEmitter();

  public differ: any;
  public enableButtonFilter = true;
  public isMobile: boolean;
  public setDtStart: any;
  public setDtEnd: any;
  public color: string;
  public isDark: boolean;

  private theme: string;
  private themeInverse: string;

  constructor(
    private store: Store,
    private differs: KeyValueDiffers,
    private breakpoint: BreakpointObserver,
    private chartService: ChartService,
    private dashboardServices: DashboardService
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
      .subscribe();

    // this.dashboardServices.fetchLastDate().subscribe((dt) => console.log(dt));
    this.startChart();
  }

  public ngOnChanges(): void {}

  public ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'data') {
          this.startChart();
        }
      });
    }
  }

  private startChart(): void {
    this.chartService.getCharts().subscribe((chart) => {
      chart.chart.type = this.type;
      chart.chart.backgroundColor = this.theme;
      chart.tooltip.backgroundColor = this.theme;
      chart.yAxis.labels.style.color = this.themeInverse;
      chart.xAxis.labels.style.color = this.themeInverse;
      chart.legend.itemStyle.color = this.themeInverse;

      chart.series = this.data;
      chart.xAxis.categories = this.data[0].dates;
      Highcharts.chart(this.highchartLine.nativeElement, chart);
    });
  }

  private mapToProps(states: any): any {
    this.isDark = !(states.theme === 'dark-mode');

    if (this.isDark) {
      this.theme = 'var(--white-one)';
      this.themeInverse = 'var(--color-dark-secondary)';
    } else {
      this.theme = 'var(--color-dark-secondary)';
      this.themeInverse = 'var(--white-one)';
    }
    this.dtEnd = states.dates.dt_end;
    this.dtStart = states.dates.dt_start;
    return states;
  }

  private abstractStates({ dashboard }: any): any {
    return {
      theme: dashboard.dark_mode,
      dates: dashboard.graph_dates,
      outcome_income: dashboard.outcome_income,
    };
  }

  public filterEnd = (d: any): boolean => {
    return moment(d).isSameOrAfter(moment(new Date()));
  };

  public filterStart = (d: any): boolean => {
    return moment(d).isSameOrBefore(moment(new Date()));
  };

  public onSubmit(): void {
    this.store.dispatch(
      actionsDashboard.FETCH_DATES({
        payload: {
          dt_end: moment(this.dtEnd),
          dt_start: moment(this.dtStart),
        },
      })
    );
    this.send.emit('update-graph');
  }
}
