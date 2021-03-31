import { BrowserModule } from '@angular/platform-browser'
import { LOCALE_ID, NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { OrganizeseStore } from './store/organizese.store'
import { RegistersEffect } from './effects/registers.effects'
import { DashboardEffect } from './effects/dashboard.effects'
import { CommonModule, registerLocaleData } from '@angular/common'
import localePt from '@angular/common/locales/pt'
import { HomeComponent } from './pages/home/home.component'
import { Constants } from './services/constants'
import { AngularCreatePdfModule } from 'angular-create-pdf'
import { AppService } from './services/app.service'
import { AppEffect } from './effects/app.effects'
import { LoginModule } from './pages/login/login.module'
import { MaterialModule } from './material.module'
import { LoginEffect } from './effects/login.effects'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { DashboardInterceptor } from './interceptor/dashboard.interceptor'
import { NgxMaskModule } from 'ngx-mask'
import { ProfileEffect } from './effects/profile.effect'
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core'
import { MomentDateAdapter } from '@angular/material-moment-adapter'
import { DashboardModule } from './pages/dashboard/dashboard.module'
import { getSaver, SAVER } from './providers/save.provider';
import { CustomSnackbarComponent } from './components/custom-snackbar/custom-snackbar.component';

registerLocaleData(localePt, 'pt-BR')

const indexedConfig: DBConfig = {
  name: 'organizese',
  version: 3, // only work on this version
  objectStoresMeta: [{
    store: 'organizese',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: []
  }],
}
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CustomSnackbarComponent,
  ],
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
      DashboardEffect
    ])
  ],
  entryComponents: [
    // DialogsComponent
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: HTTP_INTERCEPTORS, useClass: DashboardInterceptor, multi: true },
    { provide: Constants },
    { provide: AppService },
    { provide: SAVER, useFactory: getSaver }
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
