import { Component, OnInit } from '@angular/core';
import { version, author, description } from '../../../../../../package.json';

@Component({
  selector: 'app-settings-about',
  templateUrl: './settings-about.component.html',
  styleUrls: ['./settings-about.component.scss'],
})
export class SettingsAboutComponent implements OnInit {
  public version: any;
  public author: any;
  public description: any;

  constructor() {}

  ngOnInit(): void {
    this.version = version;
    this.author = author;
    this.description = description;
  }
}
