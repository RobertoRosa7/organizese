import { LOCALE_ID, NgModule } from "@angular/core"
import { registerLocaleData } from "@angular/common"
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core'
import { MomentDateAdapter } from '@angular/material-moment-adapter'
import localePt from '@angular/common/locales/pt'
import { RouterModule, Routes } from "@angular/router"
import { SettingsComponent } from "./settings/settings.component"
import { RegistersComponent } from "./registers/registers.component"
import { FormIncomingComponent } from "src/app/components/form-incoming/form-incoming.component"
import { GridComponent } from "src/app/components/grid/grid.component"
import { DashboardComponent } from "./dashboard.component"
import { CardsComponent } from "src/app/components/cards/cards.component"
import { MainComponent } from './main/main.component'
import { ResultSearchComponent } from './result-search/result-search.component'
import { DialogFormIncomingComponent } from "src/app/components/dialog-form-incoming/dialog-form-incoming.component"
import { TitleComponent } from "src/app/components/title/title.component"
import { TabsComponent } from '../../components/tabs/tabs.component'
import { TabMenuComponent } from '../../components/tabs/tab-menu/tab-menu.component'
import { TabContentComponent } from '../../components/tabs/tab-content/tab-content.component'
import { TabHeaderComponent } from '../../components/tabs/tab-header/tab-header.component'
import { DialogConfirmComponent } from "src/app/components/dialog-confirm/dialog-confirm.component"
import { ListRegistersComponent } from '../../components/list-registers/list-registers.component'
import { HighchartsComponent } from '../../components/highcharts/highcharts.component';
import { DialogsComponent } from '../../components/dialogs/dialogs.component';
import { PanelControlComponent } from '../../components/panel-control/panel-control.component'
import { MaterialModule } from "src/app/material.module"
import { NgxMaskModule } from 'ngx-mask'
import { LoaderComponent } from "src/app/components/loader/loader.component"
import { OwlModule } from 'ngx-owl-carousel'
import { SettingsMenuComponent } from './settings/settings-menu/settings-menu.component'
import { DarkThemeComponent } from "src/app/components/dark-theme/dark-theme.component";
import { SettingsAboutComponent } from './settings/settings-about/settings-about.component';
import { SettingsProfileComponent } from './settings/settings-profile/settings-profile.component';
import { SettingsNewPasswordComponent } from './settings/settings-new-password/settings-new-password.component'

const routes: Routes = [
  {
    path: '', component: DashboardComponent, children: [
      { path: '', component: MainComponent },
      {
        path: 'settings', component: SettingsComponent, children: [
          { path: '', component: SettingsMenuComponent },
          { path: 'profile', component: SettingsProfileComponent },
          { path: 'about', component: SettingsAboutComponent },
          { path: 'new-password', component: SettingsNewPasswordComponent },
        ]
      },
      { path: 'registers', component: RegistersComponent },
      { path: 'result-search', component: ResultSearchComponent },
    ]
  },
]

export const MY_FORMATS = {
  parse: { dateInput: 'DD MM YYYY' },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
}

registerLocaleData(localePt, 'pt')

@NgModule({
  declarations: [
    DashboardComponent,
    SettingsComponent,
    RegistersComponent,
    FormIncomingComponent,
    GridComponent,
    CardsComponent,
    MainComponent,
    ResultSearchComponent,
    DialogFormIncomingComponent,
    TitleComponent,
    TabsComponent,
    TabMenuComponent,
    TabContentComponent,
    TabHeaderComponent,
    DialogConfirmComponent,
    ListRegistersComponent,
    HighchartsComponent,
    PanelControlComponent,
    LoaderComponent,
    SettingsMenuComponent,
    DarkThemeComponent,
    SettingsAboutComponent,
    SettingsProfileComponent,
    SettingsNewPasswordComponent
  ],
  exports: [
    LoaderComponent,
    TabsComponent,
    TabMenuComponent,
    TabContentComponent,
    TabHeaderComponent,
    DarkThemeComponent
  ],
  imports: [
    MaterialModule,
    OwlModule,
    RouterModule.forChild(routes),
    NgxMaskModule.forChild()
  ],
  entryComponents: [
    DialogFormIncomingComponent,
    DialogConfirmComponent,
    DialogsComponent
  ],
  // exports: [],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: LOCALE_ID, useValue: 'pt' },
  ],
  // entryComponents: []
})
export class DashboardModule { }