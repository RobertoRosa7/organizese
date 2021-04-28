import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as actionsDashboard from '../actions/dashboard.actions';
import { SET_ERRORS, SET_SUCCESS } from '../actions/errors.actions';
import * as actions from '../actions/registers.actions';
import { DashboardService } from '../services/dashboard.service';

@Injectable()
export class RegistersEffect {
  private props = {
    fetch_registers: 'fetch_registers',
    new_register: 'new_register',
    delete_register: 'delete_register',
    update_register: 'update_register',
    fetch_search: 'fetch_search',
  };

  constructor(
    private action: Actions,
    private store: Store,
    private dashboardService: DashboardService
  ) {}

  @Effect()
  public init$: Observable<Actions> = this.action.pipe(
    ofType(actions.actionsTypes.INIT),
    mergeMap(({ payload }) =>
      this.dashboardService
        .fetchRegisters(payload)
        .pipe(catchError((e) => of(e)))
    ),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: this.props.fetch_registers };
        return SET_ERRORS({ payload: source });
      } else {
        return actions.GET_REGISTERS({ payload });
      }
    }),
    catchError((err) => of(err))
  );

  @Effect()
  public addedRegister$: Observable<Actions> = this.action.pipe(
    ofType(actions.ADDED_REGISTERS),
    mergeMap(({ payload }) =>
      this.dashboardService.newRegister(payload).pipe(catchError((e) => of(e)))
    ),
    map((response) => {
      if (response instanceof HttpErrorResponse) {
        const source = { ...response, source: this.props.new_register };
        return SET_ERRORS({ payload: source });
      } else {
        this.dispatchActions({ payload: this.props.new_register });
        return actions.INIT({ payload: {} });
      }
    }),
    catchError((e) => of(e))
  );

  @Effect()
  public addRegisters$: Observable<Actions> = this.action.pipe(
    ofType(actions.actionsTypes.ADD_REGISTERS),
    mergeMap(({ payload }) => [
      actions.ADDED_REGISTERS({ payload }),
      actions.SET_REGISTERS({ payload }),
    ]),
    catchError((err) => of(err))
  );

  @Effect()
  public deleteRegisters$: Observable<Actions> = this.action.pipe(
    ofType(actions.actionsTypes.DELETE_REGISTERS),
    mergeMap(({ payload }: any) =>
      this.dashboardService
        .deleteRegister(payload)
        .pipe(catchError((e) => of(e)))
    ),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: this.props.delete_register };
        return SET_ERRORS({ payload: source });
      } else {
        this.dispatchActions({ payload: this.props.delete_register });
        return actions.GET_REGISTERS({ payload });
      }
    }),
    catchError((err) => of(err))
  );

  @Effect()
  public showTab$: Observable<Actions> = this.action.pipe(
    ofType(actions.actionsTypes.GET_SHOWTAB),
    map(({ payload }: any) => {
      const showtabs: any = {};
      payload.forEach((e: any) => (showtabs[e] = true));
      return actions.SET_SHOWTAB({ payload: showtabs });
    }),
    catchError((err) => of(err))
  );

  @Effect()
  public updateRegister$: Observable<Actions> = this.action.pipe(
    ofType(actions.actionsTypes.UPDATE_REGISTER),
    mergeMap(({ payload }: any) =>
      forkJoin([
        this.dashboardService
          .updateRegister(payload)
          .pipe(catchError((e) => of(e))),
        of(payload),
      ])
    ),
    map(([response, _]) => {
      if (response instanceof HttpErrorResponse) {
        const source = { ...response, source: this.props.update_register };
        return SET_ERRORS({ payload: source });
      } else {
        this.dispatchActions({ payload: this.props.update_register });
        return actions.SET_UPDATE({ payload: response.data });
      }
    }),
    catchError((err) => of(err))
  );

  @Effect()
  public fetchSearch$: Observable<Actions> = this.action.pipe(
    ofType(actions.actionsTypes.GET_SEARCH),
    mergeMap(({ payload }: any) =>
      forkJoin([
        this.dashboardService
          .fetchSearch(payload)
          .pipe(catchError((e) => of(e))),
        of(payload),
      ])
    ),
    map(([response, _]) => {
      if (response instanceof HttpErrorResponse) {
        const source = { ...response, source: this.props.fetch_search };
        return SET_ERRORS({ payload: source });
      } else {
        return actions.SET_SEARCH({ payload: response.search });
      }
    }),
    catchError((err) => of(err))
  );

  private async dispatchActions(payload?: any): Promise<any> {
    this.store.dispatch(SET_SUCCESS(payload));
    await this.putDashboard();
    await this.putConsolidado();
    await this.putGraphOutcomeIncome();
    await this.putLastDateOutcome();
    await this.putAutocomplete();
  }

  private putDashboard(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.PUT_DASHBOARD())
    );
  }

  private putConsolidado(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.PUT_CONSOLIDADO())
    );
  }

  private putGraphOutcomeIncome(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.PUT_GRAPH_OUTCOME_INCOME())
    );
  }

  private putLastDateOutcome(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.PUT_LASTDATE_OUTCOME())
    );
  }

  private putAutocomplete(): Promise<any> {
    return Promise.resolve(
      this.store.dispatch(actionsDashboard.UPDATE_AUTOCOMPLETE())
    );
  }
}
