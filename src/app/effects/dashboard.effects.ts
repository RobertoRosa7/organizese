import { Injectable } from '@angular/core'
import { Actions, ofType, Effect } from '@ngrx/effects'
import { forkJoin, from, Observable, of } from 'rxjs'
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators'
import * as actions from '../actions/dashboard.actions'
import { IndexdbService } from '../services/indexedbs.service'
import { SET_ERRORS, GET_STATUS_CODE, SET_STATUS_CODE } from '../actions/errors.actions'
import { DashboardService } from '../services/dashboard.service'
import { HttpErrorResponse } from '@angular/common/http'
import { Store } from '@ngrx/store'

@Injectable()
export class DashboardEffect {
  constructor(
    private _action: Actions,
    private _indexedb: IndexdbService,
    private _dashboardService: DashboardService,
    private _store: Store
  ) {
  }

  @Effect()
  public init$: Observable<Actions> = this._action.pipe(
    ofType(actions.actionsTypes.INIT_DASHBOARD),
    mergeMap(() => this._dashboardService.fetchConsolidado().pipe(catchError(e => of(e)))),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'calc_consolidado' }
        return SET_ERRORS({ payload: source })
      } else {
        return actions.GET_TOTALS({ payload })
      }
    }),
    catchError(err => of(err))
  )

  @Effect()
  public getAutocomplete$: Observable<Actions> = this._action.pipe(
    ofType(actions.FETCH_AUTOCOMPLETE),
    mergeMap(() => this._indexedb.getById('autocomplete_id')),
    mergeMap((autocomplete) => {
      if (autocomplete) {
        return [actions.SET_AUTOCOMPLETE({ payload: autocomplete.auto_complete })]
      } else {
        return this._dashboardService.fetchAutocomplete().pipe(
          map((autocomplete: any) => {
            if (autocomplete) this._indexedb.create({ id: 'autocomplete_id', auto_complete: autocomplete.list })
            return actions.SET_AUTOCOMPLETE({ payload: autocomplete.list })
          }),
          catchError(e => {
            const source = { ...e, source: 'autocomplete' }
            return [SET_ERRORS({ payload: source })]
          })
        )
      }
    }),
    catchError(err => of(err))
  )

  @Effect()
  public updateAutocomplete$: Observable<Actions> = this._action.pipe(
    ofType(actions.UPDATE_AUTOCOMPLETE),
    mergeMap(() => forkJoin([
      this._dashboardService.fetchAutocomplete().pipe(catchError(e => of(e))),
      this._indexedb.getById('autocomplete_id')
    ])),
    map(([autocomplete, indexedbList]) => {
      if (autocomplete instanceof HttpErrorResponse) {
        const source = { ...autocomplete, source: 'update_autocomplete' }
        return SET_ERRORS({ payload: source })
      } else {
        if (indexedbList) {
          this._indexedb.update({ id: 'autocomplete_id', auto_complete: autocomplete.list })
          return actions.SET_AUTOCOMPLETE({ payload: autocomplete.list })
        } else {
          this._indexedb.create({ id: 'autocomplete_id', auto_complete: autocomplete.list })
          return actions.SET_AUTOCOMPLETE({ payload: autocomplete.list })
        }
      }
    }),
    catchError(err => of(err))
  )

  @Effect()
  public fetchEvolucao$: Observable<Actions> = this._action.pipe(
    ofType(actions.FETCH_EVOLUCAO),
    switchMap(() => from(this.getDatesFromStore())),
    mergeMap(({ dates }) => this._dashboardService.fetchEvocucao(dates.income).pipe(catchError(e => of(e)))),
    map((payload: any) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'fetch_evolucao' }
        return SET_ERRORS({ payload: source })
      } else {
        return actions.SET_EVOLUCAO({ payload })
      }
    }),
    catchError(e => of(e))
  )

  @Effect()
  public fetchEvolucaoDespesas$: Observable<Actions> = this._action.pipe(
    ofType(actions.FETCH_EVOLUCAO_DESPESAS),
    switchMap(() => from(this.getDatesFromStore())),
    mergeMap(({ dates }) => this._dashboardService.fetchEvocucaoDespesas(dates.outcome).pipe(catchError(e => of(e)))),
    map((payload: any) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'fetch_evolucao_despesas' }
        return SET_ERRORS({ payload: source })
      } else {
        return actions.SET_EVOLUCAO_DESPESAS({ payload })
      }
    }),
    catchError(e => of(e))
  )

  @Effect()
  public fetchEvolucaoDetail$: Observable<Actions> = this._action.pipe(
    ofType(actions.FETCH_EVOLUCAO_DETAIL),
    mergeMap(({ payload }) => this._dashboardService.fetchEvocucaoDetail(payload).pipe(catchError(e => of(e)))),
    map((payload: any) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'fetch_evolucao_detail' }
        return SET_ERRORS({ payload: source })
      } else {
        return actions.SET_EVOLUCAO_DETAIL({ payload })
      }
    }),
    catchError(e => of(e))
  )

  @Effect()
  public graphCategory$: Observable<Actions> = this._action.pipe(
    ofType(actions.actionsTypes.FETCH_GRAPH_CATEGORY),
    switchMap(() => from(this.getDatesFromStore())),
    mergeMap(({ dates }) => this._dashboardService.fetchGraphCategory(dates.category).pipe(catchError(e => of(e)))),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'graph_category' }
        return SET_ERRORS({ payload: source })
      } else {
        return actions.SET_GRAPH_CATEGORY({ payload })
      }
    }),
    catchError(err => of(err))
  )

  @Effect()
  public devMode$: Observable<Actions> = this._action.pipe(
    ofType(actions.GET_DEV_MODE),
    mergeMap(({ payload }) => this._dashboardService.setDevMode(payload).pipe(catchError(e => of(e)))),
    map((payload: any) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'dev_mode' }
        return SET_ERRORS({ payload: source })
      } else {
        return actions.SET_DEV_MODE({ payload })
      }
    }),
    catchError(e => of(e))
  )

  private getDatesFromStore(): Promise<any> {
    return new Promise(resolve => this._store.select(({ dashboard }: any) => ({ dates: dashboard.dates }))
      .subscribe((dates) => resolve(dates)))
  }
}
