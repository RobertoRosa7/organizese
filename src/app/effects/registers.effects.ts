import { Injectable } from '@angular/core'
import { Actions, ofType, Effect } from '@ngrx/effects'
import { Observable, of, forkJoin } from 'rxjs'
import { catchError, delay, map, mergeMap } from 'rxjs/operators'
import * as actions from '../actions/registers.actions'
import * as actionsDashboard from '../actions/dashboard.actions'
import { SET_ERRORS, SET_SUCCESS } from '../actions/errors.actions'
import { DashboardService } from '../services/dashboard.service'
import { HttpErrorResponse } from '@angular/common/http'
import { Store } from '@ngrx/store'

@Injectable()
export class RegistersEffect {

  private props = {
    fetch_registers: 'fetch_registers',
    new_register: 'new_register',
    delete_register: 'delete_register',
    update_register: 'update_register',
    fetch_search: 'fetch_search'
  }

  constructor(
    private _action: Actions,
    private _store: Store,
    private _dashboardService: DashboardService,
  ) {
  }

  @Effect()
  public init$: Observable<Actions> = this._action.pipe(
    ofType(actions.actionsTypes.INIT),
    mergeMap(({ payload }) => this._dashboardService.fetchRegisters(payload).pipe(catchError(e => of(e)))),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: this.props.fetch_registers }
        return SET_ERRORS({ payload: source })
      } else {
        return actions.GET_REGISTERS({ payload })
      }
    }),
    catchError(err => of(err))
  )

  @Effect()
  public addedRegister$: Observable<Actions> = this._action.pipe(
    ofType(actions.ADDED_REGISTERS),
    mergeMap(({ payload }) => this._dashboardService.newRegister(payload).pipe(catchError(e => of(e)))),
    map(response => {
      if (response instanceof HttpErrorResponse) {
        const source = { ...response, source: this.props.new_register }
        return SET_ERRORS({ payload: source })
      } else {
        this._store.dispatch(SET_SUCCESS({ payload: this.props.new_register }))
        this._store.dispatch(actionsDashboard.INIT_DASHBOARD())
        this._store.dispatch(actionsDashboard.FETCH_EVOLUCAO())
        this._store.dispatch(actionsDashboard.FETCH_EVOLUCAO_DESPESAS())
        this._store.dispatch(actionsDashboard.FETCH_GRAPH_CATEGORY())
        this._store.dispatch(actionsDashboard.UPDATE_AUTOCOMPLETE())
        return actions.INIT({ payload: {} })
      }
    }),
    catchError(e => of(e))
  )

  @Effect()
  public addRegisters$: Observable<Actions> = this._action.pipe(
    ofType(actions.actionsTypes.ADD_REGISTERS),
    mergeMap(({ payload }) => [
      actions.ADDED_REGISTERS({ payload }),
      actions.SET_REGISTERS({ payload }),
    ]),
    catchError(err => of(err))
  )

  @Effect()
  public deleteRegisters$: Observable<Actions> = this._action.pipe(
    ofType(actions.actionsTypes.DELETE_REGISTERS),
    mergeMap(({ payload }: any) => this._dashboardService.deleteRegister(payload).pipe(catchError(e => of(e)))),
    map(payload => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: this.props.delete_register }
        return SET_ERRORS({ payload: source })
      } else {
        this._store.dispatch(SET_SUCCESS({ payload: this.props.delete_register }))
        this._store.dispatch(actionsDashboard.INIT_DASHBOARD())
        this._store.dispatch(actionsDashboard.FETCH_EVOLUCAO())
        this._store.dispatch(actionsDashboard.FETCH_EVOLUCAO_DESPESAS())
        this._store.dispatch(actionsDashboard.FETCH_GRAPH_CATEGORY())
        this._store.dispatch(actionsDashboard.UPDATE_AUTOCOMPLETE())
        return actions.GET_REGISTERS({ payload })
      }
    }),
    catchError(err => of(err))
  )

  @Effect()
  public showTab$: Observable<Actions> = this._action.pipe(
    ofType(actions.actionsTypes.GET_SHOWTAB),
    map(({ payload }: any) => {
      const showtabs: any = {}
      payload.forEach((e: any) => showtabs[e] = true)
      return actions.SET_SHOWTAB({ payload: showtabs })
    }),
    catchError(err => of(err))
  )

  @Effect()
  public updateRegister$: Observable<Actions> = this._action.pipe(
    ofType(actions.actionsTypes.UPDATE_REGISTER),
    mergeMap(({ payload }: any) => forkJoin([
      this._dashboardService.updateRegister(payload).pipe(catchError(e => of(e))),
      of(payload)
    ])),
    map(([response, payload]) => {
      if (response instanceof HttpErrorResponse) {
        const source = { ...response, source: this.props.update_register }
        return SET_ERRORS({ payload: source })
      } else {
        this._store.dispatch(SET_SUCCESS({ payload: this.props.update_register }))
        this._store.dispatch(actionsDashboard.INIT_DASHBOARD())
        this._store.dispatch(actionsDashboard.FETCH_EVOLUCAO())
        this._store.dispatch(actionsDashboard.FETCH_EVOLUCAO_DESPESAS())
        this._store.dispatch(actionsDashboard.FETCH_GRAPH_CATEGORY())
        this._store.dispatch(actionsDashboard.UPDATE_AUTOCOMPLETE())
        return actions.SET_UPDATE({ payload: response.data })
      }
    }),
    catchError(err => of(err))
  )

  @Effect()
  public fetchSearch$: Observable<Actions> = this._action.pipe(
    ofType(actions.actionsTypes.GET_SEARCH),
    mergeMap(({ payload }: any) => forkJoin([
      this._dashboardService.fetchSearch(payload).pipe(catchError(e => of(e))),
      of(payload)
    ])),
    map(([response, payload]) => {
      if (response instanceof HttpErrorResponse) {
        const source = { ...response, source: this.props.fetch_search }
        return SET_ERRORS({ payload: source })
      } else {
        return actions.SET_SEARCH({ payload: response.search })
      }
    }),
    catchError(err => of(err))
  )

}