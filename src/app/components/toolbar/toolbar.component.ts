import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DialogFormIncomingComponent } from 'src/app/components/dialog-form-incoming/dialog-form-incoming.component';
import { Register } from 'src/app/models/models';
import * as actionsDashboard from '../../actions/dashboard.actions';
import * as actionsLogin from '../../actions/login.actions';
import * as actionsRegister from '../../actions/registers.actions';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  @Output() send = new EventEmitter();
  @Output() updateRegisters = new EventEmitter();

  public autocomplete$: Observable<string[]>;
  public notifications$: Observable<any[]>;

  public searchTerms: FormControl = new FormControl();
  public user: any;
  public isDark: boolean;

  constructor(
    private router: Router,
    private store: Store,
    protected dialog?: MatDialog
  ) {}

  ngOnInit(): void {
    this.store
      .select(({ profile, dashboard }: any) => ({
        profile: profile.user,
        theme: dashboard.dark_mode,
      }))
      .subscribe(async (state) => {
        this.isDark = !(state.theme === 'dark-mode');
        this.user = state.profile;
      });

    this.notifications$ = this.store
      .select(({ dashboard }: any) => ({
        notification: dashboard.notification_list,
      }))
      .pipe(map((states) => states.notification));
  }

  public onSubmit(): void {
    this.router?.navigate([
      'dashboard/result-search',
      { s: this.searchTerms.value },
    ]);
    this.searchTerms.reset();
  }

  public setSearch(event: MatAutocompleteSelectedEvent): void {
    this.router.navigate([
      'dashboard/result-search',
      { s: event.option.value },
    ]);
    this.searchTerms.reset();
  }

  public hideMenu(): void {
    this.send.emit('hide');
  }

  public logout(): void {
    this.router.navigateByUrl('/');
    this.store.dispatch(actionsLogin.LOGOUT());
  }

  public add(type: string): void {
    this.dialog
      ?.open(DialogFormIncomingComponent, {
        data: { type },
        panelClass: 'dialog-default',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          const payload: Register = {
            category: res.category || 'Outros',
            created_at: res.created_at,
            updated_at: res.created_at,
            type: res.type,
            value: res.value,
            status: 'pending',
            brand: res.brand || '',
            edit: false,
            user: this.user,
            description: res.description?.trim() || 'Sem descrição',
          };
          this.store?.dispatch(actionsRegister.ADD_REGISTERS({ payload }));
        }
      });
  }

  public updateAllRegisters(event: Event): void {
    event.stopPropagation();
    this.updateRegisters.emit('update');
  }

  public formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      currency: 'BRL',
      minimumFractionDigits: 2,
    }).format(valor);
  }
}
