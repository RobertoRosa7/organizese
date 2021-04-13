import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  public logo = './assets/icon-deffault-transparent-512x512.svg';
  constructor() {
    this.logo = './assets/' + this.getLogo();
  }

  ngOnInit(): void {}

  public getLogo(): string {
    if (localStorage.getItem('user-theme')) {
      if (localStorage.getItem('user-theme') === 'dark-mode') {
        return 'icon-default-dark-512x512.svg';
      } else {
        return 'icon-default-stroke-512x512.svg';
      }
    } else {
      return 'icon-deffault-transparent-512x512.svg';
    }
  }
}
