import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { DialogsComponent } from 'src/app/components/dialogs/dialogs.component';
import { AppService } from 'src/app/services/app.service';
import { Constants } from 'src/app/services/constants';
import { LoginService } from 'src/app/services/login.service';
import * as actionsErrors from '../../actions/errors.actions';

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
    private constants: Constants,
    private store: Store
  ) {
    this.logo = this.constants.get('file_images') + this.getLogo();
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
        this.store.dispatch(actionsErrors.RESET_ERRORS());
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

  public isDark(): boolean {
    return localStorage.getItem('user-theme') === 'light-mode';
  }

  private goto(path: string): void {
    this.router.navigateByUrl(path);
  }
}
