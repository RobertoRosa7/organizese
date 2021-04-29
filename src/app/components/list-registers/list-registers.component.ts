import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Register } from 'src/app/models/models';
import * as actionsRegister from '../../actions/registers.actions';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { DialogFormIncomingComponent } from '../dialog-form-incoming/dialog-form-incoming.component';
import { DialogsComponent } from '../dialogs/dialogs.component';

@Component({
  selector: 'app-list-registers',
  templateUrl: './list-registers.component.html',
  styleUrls: ['./list-registers.component.scss'],
})
export class ListRegistersComponent implements OnInit {
  @Input() public item: Register;
  @Output() public send = new EventEmitter();

  public isMobile: boolean;
  public isDark: boolean;

  constructor(
    private breakpoint: BreakpointObserver,
    private store: Store,
    private dialog: MatDialog
  ) {
    this.breakpoint
      .observe([Breakpoints.XSmall])
      .subscribe((result) => (this.isMobile = !!result.matches));
  }

  ngOnInit(): void {
    const states = this.store.select(({ dashboard }: any) => ({
      theme: dashboard.dark_mode,
    }));

    states.subscribe(
      (state) => (this.isDark = !(state.theme === 'light-mode'))
    );
  }

  public edit(_: Event, payload: Register): void {
    this.dialog
      .open(DialogFormIncomingComponent, {
        data: { ...payload, edit: true },
        panelClass: 'dialog-default',
      })
      .beforeClosed()
      .subscribe((res) => {
        if (res) {
          this.store.dispatch(
            actionsRegister.UPDATE_REGISTER({
              payload: {
                ...payload,
                value: res.value,
                created_at: new Date(res.date).getTime() / 1000,
                description: res.description,
                category: res.category,
              },
            })
          );
          this.send.emit('edit');
        }
      });
  }

  public del(_: Event, payload: Register): void {
    this.dialog
      .open(DialogConfirmComponent, {
        data: payload,
        panelClass: 'dialog-default',
      })
      .beforeClosed()
      .subscribe((response) => {
        if (response) {
          this.store.dispatch(actionsRegister.DELETE_REGISTERS({ payload }));
          this.send.emit('delete');
        }
      });
  }

  public details(_: Event, payload: any): void {
    _.stopPropagation();
    this.dialog
      .open(DialogsComponent, {
        data: { type: 'details', data: payload },
        panelClass: 'dialog-default',
      })
      .beforeClosed()
      .subscribe((res: any) => {
        if (res && res.operation === 'edit') {
          this.edit(_, res.payload);
        } else if (res && res.operation === 'del') {
          this.del(_, res.payload);
        }
      });
  }

  public formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(valor);
  }
}
