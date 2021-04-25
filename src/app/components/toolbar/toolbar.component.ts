import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as actionsDashboard from '../../actions/dashboard.actions';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  public searchTerms: FormControl = new FormControl();
  private timeDelay = 1500;
  public autocomplete$: Observable<string[]>;

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {}

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
}
