import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, DoCheck, ElementRef, Input, KeyValueDiffers, OnInit, ViewChild } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Store } from '@ngrx/store';
import * as Highcharts from 'highcharts'

const Boost = require('highcharts/modules/boost')
const noData = require('highcharts/modules/no-data-to-display')
const More = require('highcharts/highcharts-more')

Boost(Highcharts)
noData(Highcharts)
More(Highcharts)
noData(Highcharts)

const MY_FORMATS = {
  parse: { dateInput: 'DD MM YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
}
@Component({
  selector: 'app-highcharts',
  templateUrl: './highcharts.component.html',
  styleUrls: ['./highcharts.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ]
})
export class HighchartsComponent implements OnInit, DoCheck {
  @ViewChild('highchartEvoution', { static: true }) highchartEvoution: ElementRef
  @ViewChild('highchartPie', { static: true }) highchartPie: ElementRef

  @Input() public evolucao: any
  @Input() public category: any
  @Input() public operation: string

  public isMobile: boolean

  public chartLine: any = {
    chart: {
      type: 'column',
      height: 400
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
        color: ''
      }
    },
    yAxis: {
      gridLineDashStyle: 'longdash',
      title: { text: '' },
      opposite: false,
      labels: {
        formatter(): any {
          const self: any = this
          let str: string = ''
          if (self.value > 0) {
            str += `R$ ${Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2 })
              .format(self.value.toFixed(2))}`
          }
          return str
        },
        style: {
          color: ''
        }
      }
    },
    xAxis: {
      tickInterval: 10,
      categories: [],
      crosshair: true,
      labels: {
        formatter: function (): any {
          const self: any = this
          return Highcharts.dateFormat('%m/%Y', self.value * 1000)
        },
        style: {
          color: ''
        }
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
      formatter: function (): any {
        const self: any = this
        let s = `
            <div class="highchart-tooltip">
              <strong>${Highcharts.dateFormat('%d/%m/%Y', self.x * 1000)}</strong>
            </div>
          `;
        for (let i in self.points) {
          if (self.points[i].y > 0) {
            s += `<span style="color:${self.points[i].series.color}">●</span>
              <span class="highchart-text">${self.points[i].series.name}: </span>
              <b class="highchart-text">
              R$ ${Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2 })
                .format(self.points[i].y.toFixed(2))}</b>
            <br/>
          `
          }
        }
        return s
      }
    },
    plotOptions: {
      // line: {
      //   marker: {
      //     enabled: false
      //   }
      // },
      series: {
        pointPadding: 0,
        // states: {
        //   hover: {
        //     color: 'rgba(68, 188, 93, 1)'
        //   }
        // }

        // enableMouseTracking: false,

        // dataLabels: {
        //   enabled: true,
        //   formatter: function () {
        //     const self: any = this
        //     let str: string = ''
        //     if (self.point.y > 0) {
        //       str += `R$ ${Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2 })
        //         .format(self.point.y.toFixed(2))}`
        //     }
        //     return str
        //   },
        //   style: {
        //     fontSize: '9px',
        //   }
        // }
      },
      column: {
        pointPadding: 0,
        borderWidth: 0,
        pointWidth: 20
      }
    },
    // lang: {
    //   noData: ''
    // },
    series: []
  }
  public chartPie: any = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie'
    },
    title: {
      text: ''
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    // tooltip: {
    //   borderWidth: 0,
    //   borderRadius: 8,
    //   shadow: true,
    //   padding: 10,
    //   zIndex: 1,
    //   useHTML: true,
    //   shared: true,
    //   crosshairs: true,
    //   formatter: function (): any {
    //     const self: any = this
    //     let s = `
    //         <div class="highchart-tooltip">
    //           <strong>${Highcharts.dateFormat('%d/%m/%Y', self.x * 1000)}</strong>
    //         </div>
    //       `;
    //     for (let i in self.points) {
    //       if (self.points[i].y > 0) {
    //         s += `<span style="color:${self.points[i].series.color}">●</span>
    //           <span class="highchart-text">${self.points[i].series.name}: </span>
    //           <b class="highchart-text">
    //           R$ ${Intl.NumberFormat('pt-BR', { currency: 'BRL', minimumFractionDigits: 2 })
    //             .format(self.points[i].y.toFixed(2))}</b>
    //         <br/>
    //       `
    //       }
    //     }
    //     return s
    //   }
    // },
    legend: {
      enabled: true,
      itemStyle: {
        color: ''
      }
    },
    credits: { enabled: false },
    accessibility: {
      point: {
        valueSuffix: '%'
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false
        },
        showInLegend: true
      }
    },
    series: [{ name: 'Brands', colorByPoint: true, data: [] }]
    // series: [
    //   {
    //     name: 'Brands',
    //     colorByPoint: true,
    //     data: [
    //       {
    //         name: 'Chrome',
    //         y: 61.41,
    //         sliced: true,
    //         selected: true
    //       },
    //       {
    //         name: 'Internet Explorer',
    //         y: 11.84
    //       },
    //       {
    //         name: 'Firefox',
    //         y: 10.85
    //       },
    //       {
    //         name: 'Edge',
    //         y: 4.67
    //       },
    //       {
    //         name: 'Safari',
    //         y: 4.18
    //       },
    //       {
    //         name: 'Other',
    //         y: 7.05
    //       }
    //     ]
    //   }
    // ]
  }

  public data: any = {}
  public differ: any

  constructor(
    private _store: Store,
    private _differs: KeyValueDiffers,
    private _breakpoint: BreakpointObserver
  ) {
    this._breakpoint?.observe([Breakpoints.XSmall]).subscribe(result => this.isMobile = !!result.matches)
    this.differ = this._differs.find({}).create()
  }

  public ngOnInit(): void {
    this._store.select(({ dashboard }: any) =>
      ({ mode: dashboard.dark_mode, evolucao: dashboard.evolucao })).subscribe(state => {
        let theme = state.mode === 'light-mode' ? 'var(--color-medium-white)' : 'var(--color-default-dark)'
        let themeInverse = state.mode != 'light-mode' ? 'var(--color-medium-white)' : 'var(--color-default-dark)'

        this.chartLine.chart.backgroundColor = theme
        this.chartLine.tooltip.backgroundColor = theme
        this.chartLine.yAxis.gridLineColor = themeInverse
        this.chartLine.yAxis.labels.style.color = themeInverse
        this.chartLine.xAxis.labels.style.color = themeInverse
        this.chartLine.legend.itemStyle.color = themeInverse

        this.chartPie.chart.backgroundColor = theme
        this.chartPie.legend.itemStyle.color = themeInverse
      })
  }

  public ngDoCheck(): void {
    const change = this.differ.diff(this)
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'evolucao') {
          switch (this.operation) {
            case 'despesas':
              this.instanceHighchart().then(() =>
                Highcharts.chart(this.highchartEvoution.nativeElement, this.chartLine))
              break
            case 'receita':
              this.instanceHighchart().then(() =>
                Highcharts.chart(this.highchartEvoution.nativeElement, this.chartLine))
              break
          }
        }

        if (item.key === 'category') {
          this.instanceHighchart().then(() =>
            Highcharts.chart(this.highchartPie.nativeElement, this.chartPie))
        }
      })
    }
  }

  public instanceHighchart(): Promise<any> {
    return new Promise(resolve => {
      const values: any = []
      switch (this.operation) {
        case 'despesas':
          if (this.evolucao.graph_evolution) {
            for (const i in this.evolucao.graph_evolution) {
              if (i !== 'dates') {
                values.push({
                  name: this.evolucao.graph_evolution[i].label,
                  data: this.evolucao.graph_evolution[i].values,
                })
              }
            }
            this.chartLine.series = values
            this.chartLine.xAxis.categories = this.evolucao.graph_evolution.dates
          }
          break
        case 'receita':
          if (this.evolucao.graph_evolution) {
            for (const i in this.evolucao.graph_evolution) {
              if (i !== 'dates') {
                values.push({
                  name: this.evolucao.graph_evolution[i].label,
                  data: this.evolucao.graph_evolution[i].values,
                })
              }
            }
            this.chartLine.series = values
            this.chartLine.xAxis.categories = this.evolucao.graph_evolution.dates
          }
          break
        case 'categoria':
          this.chartPie.series[0].data = this.category
          console.log(this.chartPie)
          break
      }
      resolve(true)
    })
  }
}
