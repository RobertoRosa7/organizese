import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, mergeMap, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() isDark: boolean;
  @Output() send = new EventEmitter();

  public searchTerms: FormControl = new FormControl();
  public autocomplete: string[] = [];
  public autocomplete$: Observable<string[]>;
  public dashboard$: Observable<any>;

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.dashboard$ = this.store.select(({ dashboard }: any) => ({
      autocomplete: dashboard.auto_complete,
    }));

    this.autocomplete$ = this.searchTerms.valueChanges.pipe(
      mergeMap((value) =>
        this.dashboard$.pipe(
          startWith(''),
          map((states) => {
            if (states.autocomplete && value) {
              return this.filterAutocomplete(states.autocomplete, value);
            } else {
              return states.autocomplete;
            }
          })
        )
      )
    );
  }

  public onSubmit() {
    this.send.emit('close');
    this.router.navigate([
      'dashboard/result-search',
      { s: this.searchTerms.value },
    ]);
    this.searchTerms.reset();
  }

  private filterAutocomplete(list: string[], value: string = ''): string[] {
    return list
      .filter((op) => op.toLowerCase().includes(value.toLowerCase()))
      .sort();
  }

  public setSearch(event: MatAutocompleteSelectedEvent): void {
    this.send.emit('close');
    this.router.navigate([
      'dashboard/result-search',
      { s: event.option.value },
    ]);
    this.searchTerms.reset();
  }
}
