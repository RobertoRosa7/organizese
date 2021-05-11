import {
  AfterViewInit,
  Component,
  HostBinding,
  OnInit,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import * as actionsApp from './actions/app.actions';
import * as actionsDashboard from './actions/dashboard.actions';
import { Constants } from './services/constants';
import { IpcService } from './services/ipc.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @HostBinding('class.app') loading = true;
  private renderer: Renderer2;
  private colorTheme = '';
  public isOnline = false;
  public isLoading = true;
  public isError = false;
  public isDark: boolean;
  public logo = './assets/icon-default-white-512x512.svg';
  public iconLoading = './assets/icon-default-white-512x512.svg';

  constructor(
    private rendereFactory: RendererFactory2,
    private store: Store,
    private ipcService: IpcService,
    private constants: Constants,
    private sanitizer: DomSanitizer,
    private matIconRegistry: MatIconRegistry
  ) {
    this.logo = this.constants.get('file_images') + this.getLogo();
    this.renderer = this.rendereFactory.createRenderer(null, null);
    this.initTheme();
    this.isDark = this.isDarkMode();
  }

  public ngOnInit(): void {
    this.store.dispatch(
      actionsDashboard.DARK_MODE({ payload: this.colorTheme })
    );
    this.store.dispatch(actionsApp.ONLINE());
    this.store
      .select(({ http_error, app }: any) => ({
        errors: http_error.error,
        online: app.online,
      }))
      .subscribe((state) => {
        if (state.errors && state.online) {
          setTimeout(() => {
            this.isOnline = true;
            this.isLoading = false;
            this.loading = false;
          }, 1000);
        }
        // this.ipcService?.send('reload', 'from angular to electron');
        // this.ipcService?.on(
        //   'reloaded',
        //   (_: Electron.IpcMessageEvent, message: any) => {
        //     console.log(message);
        //   }
        // );
      });
  }

  public ngAfterViewInit(): void {
    this.addSvgIcon('excel-icon')
      .addSvgIcon('icon-default-white-512x512')
      .addSvgIcon('menu_black_24dp')
      .addSvgIcon('search_black_24dp')
      .addSvgIcon('close_black_24dp')
      .addSvgIcon('notifications_none_black_24dp')
      .addSvgIcon('notifications_black_24dp')
      .addSvgIcon('upgrade_black_24dp')
      .addSvgIcon('account_circle_black_24dp')
      .addSvgIcon('trending_down_black_24dp')
      .addSvgIcon('add_black_24dp')
      .addSvgIcon('trending_up_black_24dp')

      .addSvgIcon('trending_up_white_24dp')
      .addSvgIcon('add_white_24dp')
      .addSvgIcon('upgrade_white_24dp')
      .addSvgIcon('notifications_none_white_24dp')
      .addSvgIcon('notifications_white_24dp')
      .addSvgIcon('close_white_24dp')
      .addSvgIcon('search_white_24dp')
      .addSvgIcon('menu_white_24dp')
      .addSvgIcon('account_circle_white_24dp')
      .addSvgIcon('trending_down_white_24dp');
  }

  public initTheme(): void {
    if (localStorage.getItem('user-theme')) {
      this.colorTheme = localStorage.getItem('user-theme') || '';
    } else {
      this.colorTheme = 'light-mode';
    }
    this.renderer.addClass(document.body, this.colorTheme);
  }

  public isDarkMode(): boolean {
    return this.colorTheme === 'dark-mode';
  }

  public getLogo(): string {
    if (localStorage.getItem('user-theme')) {
      if (localStorage.getItem('user-theme') === 'dark-mode') {
        return 'icon-default-dark-512x512';
      } else {
        return 'icon-default-stroke-512x512';
      }
    } else {
      return 'icon-deffault-transparent-512x512';
    }
  }

  // public handlerError(error: HttpErrorResponse): void {
  //   setTimeout(() => {
  //     this.isError = true;
  //   }, 5000);
  // }

  public reloading(): void {
    // this.store.dispatch(actionsApp.ONLINE())
    window.location.reload();
  }

  private addSvgIcon(name: string, alias?: string, namespace?: string): this {
    const path = this.sanitizer.bypassSecurityTrustResourceUrl(
      'assets/' + name + '.svg'
    );
    alias = alias ? alias : name;
    if (namespace) {
      this.matIconRegistry.addSvgIconInNamespace(namespace, alias, path);
    } else {
      this.matIconRegistry.addSvgIcon(alias, path);
    }
    return this;
  }
}
