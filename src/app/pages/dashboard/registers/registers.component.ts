import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  DoCheck,
  ElementRef,
  KeyValueDiffers,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { AngularCreatePdfService } from 'angular-create-pdf';
import { CustomSnackbarComponent } from 'src/app/components/custom-snackbar/custom-snackbar.component';
import { Constants } from 'src/app/services/constants';
import { DashboardService } from 'src/app/services/dashboard.service';
import { UtilsService } from 'src/app/utils/utis.service';
import * as actionsRegister from '../../../actions/registers.actions';
import { Register, User } from '../../../models/models';
import { DashboardComponent } from '../dashboard.component';

@Component({
  selector: 'app-registers',
  templateUrl: './registers.component.html',
  styleUrls: ['./registers.component.scss'],
})
export class RegistersComponent
  extends DashboardComponent
  implements OnInit, AfterViewInit, DoCheck {
  @ViewChild('extrato') public extrato: ElementRef;

  public ELEMENT_DATA: Register[] = [];
  public ELEMENT_ORDER: any[] = [];
  public tab = '';
  public inOutComing = 'all';
  public filterByDays = '7';
  public dataSource: any;
  public isMobile: boolean;
  public orderby = 'Data - decrescente';
  public total = 0;
  public detail: Register;
  public differ: any;
  private onlyComing = '';
  public evolucaoDetail: any;
  public totalDespesa = 0;
  public totalReceita = 0;
  public aPagar = 0;
  public aReceber = 0;
  public totalPercent = 0;
  public totalGeral = 0;
  public dateNow: Date = new Date();
  public isNegative = false;
  public allDaysPeriod = 0;
  public days = 0;
  public user: User;
  public isLoadingRegisters = false;

  public displayedColumns: string[] = [
    'Valor + crescente',
    'Valor - decrescente',
    'Data + crescente',
    'Data - decrescente',
    'Categoria + crescente',
    'Categoria - decrescente',
    'Descrição + crescente',
    'Descrição - decrescente',
  ];

  constructor(
    protected store: Store,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog,
    protected breakpointObserver: BreakpointObserver,
    protected differs: KeyValueDiffers,
    protected createPdf: AngularCreatePdfService,
    protected utilsService: UtilsService,
    protected dashboardService: DashboardService,
    protected constants: Constants
  ) {
    super();
    breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
    this.differ = this.differs.find({}).create();
    this.logo = this.constants.get('file_images') + this.getLogo();
  }

  public ngOnInit(): void {
    this.store
      .select(({ registers, dashboard, profile }: any) => ({
        all: [...registers.all],
        tab: registers.tab,
        total: registers.total,
        despesas: registers.total_despesas,
        receita: registers.total_receita,
        a_pagar: dashboard.consolidado.a_pagar,
        a_receber: dashboard.consolidado.a_receber,
        total_credit: dashboard.consolidado.total_credit,
        total_debit: dashboard.consolidado.total_debit,
        allDaysPeriod: registers.allDaysPeriod,
        user: profile.user,
      }))
      .subscribe(async (state) => {
        this.tab = state.tab;
        this.total = state.total;
        this.totalDespesa = state.despesas;
        this.totalReceita = state.receita;
        this.aPagar = state.a_pagar;
        this.aReceber = state.a_receber;

        this.totalPercent =
          (state.total_debit / state.total_credit) * 100 >= 100
            ? 100
            : (state.total_debit / state.total_credit) * 100;
        this.totalGeral = this.totalReceita - this.totalDespesa;
        this.allDaysPeriod = state.allDaysPeriod;

        if (this.filterByDays !== 'todos') {
          this.days = parseInt(this.filterByDays);
        }

        if (this.totalGeral < 0) {
          this.isNegative = true;
          this.totalGeral = Math.abs(this.totalGeral);
        } else {
          this.isNegative = false;
        }

        this.user = state.user;
        this.ELEMENT_ORDER = state.all;
        this.orderby
          ? this.makingOrdering(this.orderby)
          : (this.ELEMENT_DATA = this.classificar(state.all));
        this.isLoadingRegisters = false;

        // this.user = state.user
        // this.tab = state.tab
        // this.total = state.total
        // this.totalDespesa = state.despesas
        // this.totalReceita = state.receita
        // this.aPagar = state.a_pagar
        // this.aReceber = state.a_receber
        // this.ELEMENT_ORDER = state.all

        // this.totalPercent = ((state.total_debit / state.total_credit) * 100) >= 100 ? 100 : (state.total_debit / state.total_credit) * 100
        // this.totalGeral = (this.totalReceita - this.totalDespesa)
        // this.allDaysPeriod = state.allDaysPeriod

        // if (this.filterByDays !== 'todos') this.days = parseInt(this.filterByDays)
        // if (this.totalGeral < 0) {
        //   this.isNegative = true
        //   this.totalGeral = Math.abs(this.totalGeral)
        // } else {
        //   this.isNegative = false
        // }
        // this.orderby ? this.makingOrdering(this.orderby) : this.ELEMENT_DATA = this.classificar(state.all)
      });
  }

  public ngAfterViewInit(): void {}

  public ngDoCheck(): void {
    const change = this.differ.diff(this);
    if (change) {
      change.forEachChangedItem((item: any) => {
        if (item.key === 'total') {
          this.notification(`Total de registros: ${this.total}`);
        }
        if (item.key === 'onlyComing') {
          const text =
            this.onlyComing === 'incoming'
              ? 'Somente entrada'
              : 'Somente saída';
          this.notification(text);
        }
        if (item.key === 'ELEMENT_ORDER') {
          this.isLoadingRegisters = false;
        }
      });
    }
  }

  public isEmpty(user: any): Promise<any> {
    return new Promise((resolve) => {
      if (!this.utilsService.isEmpty(user)) {
        resolve(user);
      }
    });
  }

  public listeningEventForm(event: Register): void {
    if (!event) {
      this.store?.dispatch(actionsRegister.GET_TAB({ payload: 'read' }));
    } else {
      const payload: Register = {
        category: event.category || 'Outros',
        created_at: event.created_at,
        updated_at: event.created_at,
        type: event.type,
        value: event.value,
        status: 'pending',
        brand: event.brand || this.user.credit_card?.brand,
        edit: false,
        user: this.user,
        description: event.description?.trim() || 'Sem descrição',
      };
      this.store.dispatch(actionsRegister.ADD_REGISTERS({ payload }));
    }
  }

  public orderbyChange(event: MatSelectChange): void {
    this.makingOrdering(event.value);
  }

  public inOutComingChange(event: MatSelectChange): void {
    this.makingInOutComing(event.value);
  }

  public filterByDaysChange(event: MatSelectChange): void {
    const payload: any = {};
    if (event.value === 'todos') {
      this.days = this.allDaysPeriod;
      payload['todos'] = event.value;
    } else {
      this.days = parseInt(event.value);
      payload['days'] = parseInt(event.value);
    }
    this.store.dispatch(actionsRegister.INIT({ payload }));
    this.isLoadingRegisters = true;
  }

  private makingInOutComing(value: string): void {
    this.store
      .select(({ registers }: any) => ({ all: [...registers.all] }))
      .subscribe(async (state) => {
        const registers = await this.isEmpty(state.all);
        if (value === 'all') {
          this.ELEMENT_DATA = this.classificar(registers);
        } else if (value === 'pending') {
          this.ELEMENT_DATA = this.classificar(
            registers.filter(
              (v: any) =>
                v.status === 'pendente a pagar' ||
                v.status === 'pendente a receber'
            )
          );
        } else {
          this.ELEMENT_DATA = this.classificar(
            registers.filter((v: any) => v.type === value)
          );
          this.onlyComing = value;
        }
      });
  }

  private makingOrdering(value: string, registers?: Register[]): void {
    if (registers) this.ELEMENT_ORDER = registers;
    const t = this.ELEMENT_ORDER.sort((a: any, b: any) => {
      switch (value) {
        case 'Data + crescente':
          return a.created_at - b.created_at;
        case 'Data - decrescente':
          return b.created_at - a.created_at;
        case 'Categoria + crescente':
          return this.cleanText(b.category) < this.cleanText(a.category)
            ? 1
            : -1;
        case 'Categoria - decrescente':
          return this.cleanText(b.category) > this.cleanText(a.category)
            ? 1
            : -1;
        case 'Valor + crescente':
          return a.value - b.value;
        case 'Valor - decrescente':
          return b.value - a.value;
        case 'Descrição + crescente':
          return this.cleanText(a.description) > this.cleanText(b.description)
            ? 1
            : -1;
        case 'Descrição - decrescente':
          return this.cleanText(a.description) < this.cleanText(b.description)
            ? 1
            : -1;
        default:
          return 0;
      }
    });
    this.ELEMENT_DATA = this.classificar(t);
  }

  public classificar(lista: any): any {
    return lista
      .map((i: any) => ({ ...i, month: new Date(i.created_at * 1000) }))
      .reduce((prev: any, current: any) => {
        let index = prev.findIndex(
          (i: any) =>
            new Date(i.month).getMonth() == new Date(current.month).getMonth()
        );
        if (index < 0) {
          index = prev.length;
          prev.push({ month: current.month, lista: [] });
        }
        prev[index].lista.push(current);
        return prev;
      }, [])
      .map((item: any) => ({ ...item, month: new Date(item.month).getTime() }));
  }

  public downloadPdf(el: any): void {
    // setTimeout(() => this.createPdf.createPdf(el, `extrato${new Date().toLocaleDateString()}`), 200)
  }
  public imprimir(): void {
    window.print();
  }

  public getLogo(): string {
    if (localStorage.getItem('user-theme')) {
      if (localStorage.getItem('user-theme') === 'dark-mode') {
        return 'icon-default-dark-512x512';
      } else {
        return 'icon-default-stroke-512x512';
      }
    } else {
      return 'icon-default-transparent-512x512';
    }
  }

  public exportExcel(data: any): void {
    const d = data.map((v: any) => ({
      ...v,
      created_at: new Date(v.created_at * 1000).toISOString().substr(0, 10),
      type: v.type === 'incoming' ? 'entrada' : 'saida',
    }));
    this.snackbar.openFromComponent(CustomSnackbarComponent, {
      data: { to_excel: d },
    });
  }

  public onDelete(event: any): void {
    if (event === 'delete') {
      this.filterByDays = '7';
    }
  }
}
