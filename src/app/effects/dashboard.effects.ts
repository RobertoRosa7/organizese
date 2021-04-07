import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import * as actions from '../actions/dashboard.actions';
import { SET_ERRORS } from '../actions/errors.actions';
import { DashboardService } from '../services/dashboard.service';
import { IndexdbService } from '../services/indexedbs.service';

@Injectable()
export class DashboardEffect {
  constructor(
    private action: Actions,
    private indexedb: IndexdbService,
    private dashboardService: DashboardService,
    private store: Store
  ) {}

  @Effect()
  public init$: Observable<Actions> = this.action.pipe(
    ofType(actions.actionsTypes.INIT_DASHBOARD),
    mergeMap(() =>
      this.dashboardService.fetchConsolidado().pipe(catchError((e) => of(e)))
    ),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'calc_consolidado' };
        return SET_ERRORS({ payload: source });
      } else {
        return actions.GET_TOTALS({ payload });
      }
    }),
    catchError((err) => of(err))
  );

  @Effect()
  public getAutocomplete$: Observable<Actions> = this.action.pipe(
    ofType(actions.FETCH_AUTOCOMPLETE),
    mergeMap(() => this.indexedb.getById('autocomplete_id')),
    mergeMap((autocomplete) => {
      if (autocomplete) {
        return [
          actions.SET_AUTOCOMPLETE({ payload: autocomplete.auto_complete }),
        ];
      } else {
        return this.dashboardService.fetchAutocomplete().pipe(
          // tslint:disable-next-line: no-shadowed-variable
          map((autocomplete: any) => {
            if (autocomplete) {
              this.indexedb.create({
                id: 'autocomplete_id',
                auto_complete: autocomplete.list,
              });
            }
            return actions.SET_AUTOCOMPLETE({ payload: autocomplete.list });
          }),
          catchError((e) => {
            const source = { ...e, source: 'autocomplete' };
            return [SET_ERRORS({ payload: source })];
          })
        );
      }
    }),
    catchError((err) => of(err))
  );

  @Effect()
  public updateAutocomplete$: Observable<Actions> = this.action.pipe(
    ofType(actions.UPDATE_AUTOCOMPLETE),
    mergeMap(() =>
      forkJoin([
        this.dashboardService
          .fetchAutocomplete()
          .pipe(catchError((e) => of(e))),
        this.indexedb.getById('autocomplete_id'),
      ])
    ),
    map(([autocomplete, indexedbList]) => {
      if (autocomplete instanceof HttpErrorResponse) {
        const source = { ...autocomplete, source: 'update_autocomplete' };
        return SET_ERRORS({ payload: source });
      } else {
        if (indexedbList) {
          this.indexedb.update({
            id: 'autocomplete_id',
            auto_complete: autocomplete.list,
          });
          return actions.SET_AUTOCOMPLETE({ payload: autocomplete.list });
        } else {
          this.indexedb.create({
            id: 'autocomplete_id',
            auto_complete: autocomplete.list,
          });
          return actions.SET_AUTOCOMPLETE({ payload: autocomplete.list });
        }
      }
    }),
    catchError((err) => of(err))
  );

  @Effect()
  public fetchEvolucao$: Observable<Actions> = this.action.pipe(
    ofType(actions.FETCH_EVOLUCAO),
    switchMap(() => from(this.getDatesFromStore())),
    mergeMap(({ dates }) =>
      this.dashboardService
        .fetchEvocucao(dates.income)
        .pipe(catchError((e) => of(e)))
    ),
    map((payload: any) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'fetch_evolucao' };
        return SET_ERRORS({ payload: source });
      } else {
        return actions.SET_EVOLUCAO({ payload });
      }
    }),
    catchError((e) => of(e))
  );

  @Effect()
  public fetchEvolucaoDespesas$: Observable<Actions> = this.action.pipe(
    ofType(actions.FETCH_EVOLUCAO_DESPESAS),
    switchMap(() => from(this.getDatesFromStore())),
    mergeMap(({ dates }) =>
      this.dashboardService
        .fetchEvocucaoDespesas(dates.outcome)
        .pipe(catchError((e) => of(e)))
    ),
    map((payload: any) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'fetch_evolucao_despesas' };
        return SET_ERRORS({ payload: source });
      } else {
        return actions.SET_EVOLUCAO_DESPESAS({ payload });
      }
    }),
    catchError((e) => of(e))
  );

  @Effect()
  public fetchEvolucaoDetail$: Observable<Actions> = this.action.pipe(
    ofType(actions.FETCH_EVOLUCAO_DETAIL),
    mergeMap(({ payload }) =>
      this.dashboardService
        .fetchEvocucaoDetail(payload)
        .pipe(catchError((e) => of(e)))
    ),
    map((payload: any) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'fetch_evolucao_detail' };
        return SET_ERRORS({ payload: source });
      } else {
        return actions.SET_EVOLUCAO_DETAIL({ payload });
      }
    }),
    catchError((e) => of(e))
  );

  @Effect()
  public graphCategory$: Observable<Actions> = this.action.pipe(
    ofType(actions.actionsTypes.FETCH_GRAPH_CATEGORY),
    switchMap(() => from(this.getDatesFromStore())),
    mergeMap(({ dates }) =>
      this.dashboardService
        .fetchGraphCategory(dates.category)
        .pipe(catchError((e) => of(e)))
    ),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'graph_category' };
        return SET_ERRORS({ payload: source });
      } else {
        return actions.SET_GRAPH_CATEGORY({ payload });
      }
    }),
    catchError((err) => of(err))
  );

  @Effect()
  public fetchDashboard$: Observable<Actions> = this.action.pipe(
    ofType(actions.actionsTypes.FETCH_DASHBOARD),
    switchMap(() => from(this.getDatesFromStore())),
    mergeMap(({ dates, type }) =>
      this.dashboardService
        .fetchDashboard(dates[type])
        .pipe(catchError((e) => of(e)))
    ),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'set_dashboard' };
        return SET_ERRORS({ payload: source });
      } else {
        return actions.SET_DASHBOARD({ payload });
      }
    }),
    catchError((err) => of(err))
  );

  @Effect()
  public devMode$: Observable<Actions> = this.action.pipe(
    ofType(actions.GET_DEV_MODE),
    mergeMap(({ payload }) =>
      this.dashboardService.setDevMode(payload).pipe(catchError((e) => of(e)))
    ),
    map((payload: any) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'dev_mode' };
        return SET_ERRORS({ payload: source });
      } else {
        return actions.SET_DEV_MODE({ payload });
      }
    }),
    catchError((e) => of(e))
  );

  private getDatesFromStore(): Promise<any> {
    return new Promise((resolve) =>
      this.store
        .select(({ dashboard }: any) => ({
          dates: dashboard.dates,
          type: dashboard.dates.type,
        }))
        // tslint:disable-next-line: deprecation
        .subscribe((dates) => resolve(dates))
    );
  }
}
