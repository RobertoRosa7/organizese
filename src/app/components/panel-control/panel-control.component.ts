import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-panel-control',
  templateUrl: './panel-control.component.html',
  styleUrls: ['./panel-control.component.scss'],
})
export class PanelControlComponent implements OnInit {
  @Input() public aReceber = 0;
  @Input() public aPagar = 0;
  @Input() public totalDespesa = 0;
  @Input() public totalReceita = 0;
  @Input() public filterByDays = 0;
  @Input() public total = 0;

  public isMobile: boolean;

  constructor(private breakpoint: BreakpointObserver) {
    this.breakpoint
      .observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
  }

  ngOnInit(): void {}

  public formatarValor(valor = 0): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(parseFloat(valor.toFixed(2)));
  }
}
