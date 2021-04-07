import { Component, Input, OnInit } from '@angular/core';
import { Constants } from 'src/app/services/constants';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss'],
})
export class DownloadsComponent implements OnInit {
  @Input() public downloadItem: any;

  constructor(private constants: Constants) {}

  ngOnInit(): void {
    // console.log(this.downloadItem)
  }

  public isDark(): boolean {
    return localStorage.getItem('user-theme') === 'light-mode';
  }

  public download(release: string, system: string) {
    // fatura-Fevereiro_21-0043795374
    const a = document.createElement('a');
    a.href = `${this.constants.get(
      'file_download'
    )}?release=${release}&system=${system}`;
    // a.href = `${this.constants.get('file_download')}?release=fatura-Fevereiro_21-0043795374.pdf&system=windows`
    a.download = release;
    a.click();
  }
}
