import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-windows-hacker',
  templateUrl: './windows-hacker.component.html',
  styleUrls: ['./windows-hacker.component.scss'],
})
export class WindowsHackerComponent implements OnInit {
  @Input() borderHeight = '8px';
  @Input() borderWidth = '15%';
  @Input() bodyBorderLeftColor = 'inset';
  @Input() bodyBorderRightColor = 'inset';
  @Input() topBorderColor = 'inset';
  @Input() footerBorderColor = 'inset';

  constructor() {}

  ngOnInit(): void {}
}
