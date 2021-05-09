import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
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

  public searchTerms: FormControl = new FormControl();
  private timeDelay = 1500;
  public autocomplete$: Observable<string[]>;
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

  private async fetchAutocomplete(): Promise<any> {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve(this.store.dispatch(actionsDashboard.FETCH_AUTOCOMPLETE())),
        this.timeDelay
      )
    );
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
}
