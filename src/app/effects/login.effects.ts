import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as actionsApp from '../actions/app.actions';
import { SET_ERRORS } from '../actions/errors.actions';
import * as actionsLogin from '../actions/login.actions';
import { LoginService } from '../services/login.service';

@Injectable()
export class LoginEffect {
  constructor(
    private action: Actions,
    private loginService: LoginService,
    private store: Store
  ) {}

  @Effect()
  public createUser$: Observable<Actions> = this.action.pipe(
    ofType(actionsLogin.CREATE_USER),
    mergeMap(({ payload }) =>
      this.loginService.signup(payload).pipe(catchError((e) => of(e)))
    ),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'create_user' };
        return SET_ERRORS({ payload: source });
      } else {
        return actionsLogin.CREATED_USER({ payload: true });
      }
    }),
    catchError((err) => of(err))
  );

  public signin$ = createEffect(() =>
    this.action.pipe(
      ofType(actionsLogin.SIGNIN),
      mergeMap(({ payload }) =>
        this.loginService.signin(payload).pipe(catchError((e) => of(e)))
      ),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          const source = { ...payload, source: 'signin' };
          return SET_ERRORS({ payload: source });
        } else {
          return actionsLogin.SET_TOKEN({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  @Effect()
  public fetch$: Observable<Actions> = this.action.pipe(
    ofType(actionsLogin.GET_USER),
    mergeMap(() =>
      this.loginService.fetchUser().pipe(catchError((e) => of(e)))
    ),
    map((payload) => actionsLogin.SET_USER({ payload })),
    catchError((err) => of(err))
  );

  @Effect()
  public logout$: Observable<Actions> = this.action.pipe(
    ofType(actionsLogin.LOGOUT),
    mergeMap(() =>
      this.loginService.logout().pipe(
        map(() => {
          this.store.dispatch(actionsApp.RESET_ALL());
          return actionsLogin.RESET();
        })
      )
    ),
    catchError((err) => of(err))
  );
}
