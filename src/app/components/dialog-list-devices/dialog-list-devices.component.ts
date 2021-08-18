import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-list-devices',
  templateUrl: './dialog-list-devices.component.html',
  styleUrls: ['./dialog-list-devices.component.scss'],
})
export class DialogListDevicesComponent implements OnInit {
  public user: any;
  public devices: any[];
  private currentUserAgent = window.navigator.userAgent;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<DialogListDevicesComponent>
  ) {}

  ngOnInit(): void {
    this.user = this.data;
    this.devices = this.data.user_session.devices.map((value: any) =>
      this.mapDataToFormatter(value)
    );
  }

  // public getBrowser(userAgent: string) {
  //   // /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|NetFront|Silk-Accelerated|(hpw|web)OS|Fennec|Minimo|Opera M(obi|ini)|Blazer|Dolfin|Dolphin|Skyfire|Zune/
  //   const browser =
  //     /(opera|safari|firefox|chrome|msi)\/.\d+/g.exec(
  //       userAgent.toLowerCase()
  //     ) || [];
  //   return browser[0];
  // }

  // private getOS(userAgent: string): string {
  //   const os =
  //     /\s([^.*]*)([^,;]*)/.exec(userAgent.toLowerCase().replace(/\(/g, '')) ||
  //     [];
  //   return os[0].substring(0, 20);
  // }

  private getIconsByBrowser(browser: string): string {
    if (browser.includes('android')) {
      return 'android';
    } else if (browser.includes('windows')) {
      return 'microsoft_windows';
    } else if (browser.includes('edg')) {
      return 'microsoft_edge';
    } else if (browser.includes('linux')) {
      return 'linux_tux';
    } else if (browser.includes('firefox')) {
      return 'firefox';
    } else if (browser.includes('safari')) {
      return 'apple';
    } else if (browser.includes('chrome')) {
      return 'chrome';
    } else if (browser.includes('opr')) {
      return 'opera';
    } else {
      return '';
    }
  }

  private mapDataToFormatter(data: any): any {
    const str = data.device.toLowerCase().replace(/\(/g, '');
    const os = /\s([^.*]*)([^,;]*)/.exec(str) || [];

    const browser2 = /(\w{6}\w?)(\/(\d\d\.\d))(.*)/g.exec(str) || [];
    const split = browser2[0].split(' ');
    const split1 = split[0];
    const split2 = split[split.length - 1];
    const split3 = split1 + ' ' + split2;
    const split4 = /^(.*?)((?!safari).)*/g.exec(split3) || [];
    const split5 = split4[0].split(' ');

    let split6 = '';
    if (split5[split5.length - 1] !== '') {
      split6 = split5[split5.length - 1];
    } else {
      split6 = split5[0];
    }

    const icon_browser = this.getIconsByBrowser(split6);
    const icon_os = this.getIconsByBrowser(os[0].substring(0, 20));
    return {
      ...data,
      os: os[0].substring(0, 20),
      browser: split6,
      icon_browser,
      icon_os,
    };
  }
}
