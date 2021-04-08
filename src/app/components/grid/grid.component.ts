import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {
  @Input() public cols = '12';

  constructor() {}

  public ngOnInit(): void {}

  public setClassToGrid(col: string): string {
    const cols = col ? col.split(' ') : [];
    let classes = '';

    if (cols[0]) {
      classes += `col-xs-${cols[0]} `;
    }
    if (cols[1]) {
      classes += `col-sm-${cols[1]} `;
    }
    if (cols[2]) {
      classes += `col-md-${cols[2]} `;
    }
    if (cols[3]) {
      classes += `col-lg-${cols[3]} `;
    }

    return classes;
  }
}
