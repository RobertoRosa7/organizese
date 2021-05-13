import { Injectable } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  public chartLine: any = {
    chart: {
      type: '',
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
      gridLineWidth: 0,
      title: { text: '' },
      opposite: false,
      tickWidth: 1,
      lineWidth: 1,
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
      tickInterval: 2,
      categories: [],
      tickWidth: 1,
      labels: {
        formatter(): any {
          const self: any = this;
          return Highcharts.dateFormat('%m/%Y', self.value);
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
      formatter(): any {
        const self: any = this;
        let s = `
            <div class="highchart-tooltip">
              <strong>${Highcharts.dateFormat('%d/%m/%Y', self.x)}</strong>
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

  constructor() {}

  public getCharts(): Observable<any> {
    return of(this.chartLine);
  }
}
