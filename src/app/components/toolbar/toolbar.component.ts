import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as actionsDashboard from '../../actions/dashboard.actions';
import * as actionsLogin from '../../actions/login.actions';
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

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.store
      .select(({ profile, dashboard }: any) => ({
        profile: profile.user,
        theme: dashboard.dark_mode,
      }))
      .subscribe(async (state) => {
        // this.logo = './assets/' + this.getTheme(state.theme);
        this.isDark = !(state.theme === 'dark-mode');
        // this.hideValues = state.hide_values;
        // this.autocomplete = state.autocomplete;
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
}
