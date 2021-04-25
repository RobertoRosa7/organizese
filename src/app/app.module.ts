import { registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID, NgModule } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AngularCreatePdfModule } from 'angular-create-pdf';
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { NgxMaskModule } from 'ngx-mask';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';
import { AppEffect } from './effects/app.effects';
import { DashboardEffect } from './effects/dashboard.effects';
import { LoginEffect } from './effects/login.effects';
import { ProfileEffect } from './effects/profile.effect';
import { RegistersEffect } from './effects/registers.effects';
import { DashboardInterceptor } from './interceptor/dashboard.interceptor';
import { MaterialModule } from './material.module';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { HomeComponent } from './pages/home/home.component';
import { LoginModule } from './pages/login/login.module';
import { getSaver, SAVER } from './providers/save.provider';
import { AppService } from './services/app.service';
import { Constants } from './services/constants';
import { OrganizeseStore } from './store/organizese.store';

registerLocaleData(localePt, 'pt-BR');

const indexedConfig: DBConfig = {
  name: 'organizese',
  version: 3, // only work on this version
  objectStoresMeta: [
    {
      store: 'organizese',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [],
    },
  ],
};
@NgModule({
  declarations: [AppComponent, HomeComponent, CustomSnackbarComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularCreatePdfModule,
    MaterialModule,
    AppRoutingModule,
    LoginModule,
    DashboardModule,
    NgxMaskModule.forRoot(),
    NgxIndexedDBModule.forRoot(indexedConfig),
    StoreModule.forRoot(OrganizeseStore),
    StoreDevtoolsModule.instrument({ maxAge: 45 }),
    EffectsModule.forRoot([
      ProfileEffect,
      LoginEffect,
      AppEffect,
      RegistersEffect,
      DashboardEffect,
    ]),
  ],
  // exports: [WindowsHackerComponent],
  entryComponents: [
    // DialogsComponent
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: HTTP_INTERCEPTORS, useClass: DashboardInterceptor, multi: true },
    { provide: Constants },
    { provide: AppService },
    { provide: SAVER, useFactory: getSaver },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
