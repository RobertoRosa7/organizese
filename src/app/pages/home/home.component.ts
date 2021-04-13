import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { DialogsComponent } from 'src/app/components/dialogs/dialogs.component';
import { AppService } from 'src/app/services/app.service';
import { Constants } from 'src/app/services/constants';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public logo = '';
  public isLogged = false;
  public background = this.constants.get('file_images') + 'background-home-6';
  public iconName = '';
  public currentOS = '';
  public downloadList: any = {};
  public isLoading = true;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private appService: AppService,
    private constants: Constants
  ) {
    this.logo = this.constants.get('file_images') + this.getLogo();
    if (window.navigator.userAgent.indexOf('Windows NT 10.0') !== -1) {
      this.currentOS = 'Windows 10';
    }
    if (window.navigator.userAgent.indexOf('Windows NT 6.2') !== -1) {
      this.currentOS = 'Windows 8';
    }
    if (window.navigator.userAgent.indexOf('Windows NT 6.1') !== -1) {
      this.currentOS = 'Windows 7';
    }
    if (window.navigator.userAgent.indexOf('Windows NT 6.0') !== -1) {
      this.currentOS = 'Windows Vista';
    }
    if (window.navigator.userAgent.indexOf('Windows NT 5.1') !== -1) {
      this.currentOS = 'Windows XP';
    }
    if (window.navigator.userAgent.indexOf('Windows NT 5.0') !== -1) {
      this.currentOS = 'Windows 2000';
    }
    if (window.navigator.userAgent.indexOf('Mac') !== -1) {
      this.currentOS = 'Mac/iOS';
    }
    if (window.navigator.userAgent.indexOf('X11') !== -1) {
      this.currentOS = 'UNIX';
    }
    if (window.navigator.userAgent.indexOf('Linux') !== -1) {
      this.currentOS = 'Linux';
    }
  }

  public ngOnInit(): void {
    this.downloadList.current_os = this.currentOS;
    this.appService
      .downloadList()
      .pipe(map(({ download_list }) => this.addIconOnPayload(download_list)))
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.downloadList = res;
        },
        (err) => {
          this.isLoading = false;
        }
      );
  }

  private addIconOnPayload(payload: any): any {
    return {
      ...payload,
      current_os: this.currentOS,
      linux: payload.linux.map((v: any) => ({
        ...v,
        icon: this.isDark()
          ? this.constants.get('file_images') + 'logo-linux'
          : this.constants.get('file_images') + 'logo-linux-white',
      })),
      windows: payload.windows.map((v: any) => ({
        ...v,
        icon: this.isDark()
          ? this.constants.get('file_images') + 'logo-windows-black'
          : this.constants.get('file_images') + 'logo-windows-white',
      })),
      // mac: payload['mac'].map((v: any) => ({
      //   ...v,
      //   icon: this.isDark()
      //     ? this.constants.get('file_images') + 'logo-mac-black'
      //     : this.constants.get('file_images') + 'logo-mac-white'
      // }))
    };
  }

  public login(): void {
    this.dialog
      .open(DialogsComponent, {
        data: { type: 'login', data: {} },
        panelClass: 'dialog-default',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res === 'login') {
          this.goto('/dashboard');
        }
      });
  }

  public getLogo(): string {
    if (localStorage.getItem('user-theme')) {
      return this.isDark()
        ? 'icon-default-stroke-512x512'
        : 'icon-default-dark-512x512';
    } else {
      return 'icon-default-transparent-512x512';
    }
  }

  public download(): void {
    this.dialog.open(DialogsComponent, {
      data: { type: 'download', data: this.downloadList },
      panelClass: 'dialog-default',
    });
  }

  public isDark(): boolean {
    return localStorage.getItem('user-theme') === 'light-mode';
  }

  private goto(path: string): void {
    this.router.navigateByUrl(path);
  }
}
