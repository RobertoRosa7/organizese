import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
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

  private createUser$ = createEffect(() =>
    this.action.pipe(
      ofType(actionsLogin.CREATE_USER),
      mergeMap(({ payload }) =>
        this.loginService.signup(payload).pipe(catchError((e) => of(e)))
      ),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          const source = { ...payload, source: 'signup' };
          return SET_ERRORS({ payload: source });
        } else {
          this.store.dispatch(actionsLogin.LOGOUT());
          return actionsLogin.CREATED_USER({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  private signin$ = createEffect(() =>
    this.action.pipe(
      ofType(actionsLogin.SIGNIN),
      mergeMap(({ payload }) =>
        this.loginService.signin(payload).pipe(catchError((e) => of(e)))
      ),
      map((payload) => {
        if (payload instanceof HttpErrorResponse) {
          console.log(payload);

          return SET_ERRORS({ payload: { ...payload, source: 'signin' } });
        } else {
          return actionsLogin.SET_TOKEN({ payload });
        }
      }),
      catchError((err) => of(err))
    )
  );

  private fetch$ = createEffect(() =>
    this.action.pipe(
      ofType(actionsLogin.GET_USER),
      mergeMap(() =>
        this.loginService.fetchUser().pipe(catchError((e) => of(e)))
      ),
      map((payload) => actionsLogin.SET_USER({ payload })),
      catchError((err) => of(err))
    )
  );

  private logout$ = createEffect(() =>
    this.action.pipe(
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
    )
  );
}
