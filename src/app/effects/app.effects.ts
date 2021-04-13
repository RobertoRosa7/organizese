import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as actionsApp from '../actions/app.actions';
import {
  GET_STATUS_CODE,
  SET_ERRORS,
  SET_STATUS_CODE,
} from '../actions/errors.actions';
import { AppService } from '../services/app.service';
import { IndexdbService } from '../services/indexedbs.service';

@Injectable()
export class AppEffect {
  constructor(
    private action: Actions,
    private appService: AppService,
    private indexedb: IndexdbService
  ) {}

  @Effect()
  public online$: Observable<Actions> = this.action.pipe(
    ofType(actionsApp.ONLINE),
    mergeMap(() => this.appService.isOnline().pipe(catchError((e) => of(e)))),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'offline' };
        return SET_ERRORS({ payload: source });
      } else {
        return actionsApp.SET_ONLINE({ payload: true });
      }
    }),
    catchError((err) => of(err))
  );

  // @Effect()
  // public getStatusCodes$: Observable<Actions> = this.action.pipe(
  //   ofType(GET_STATUS_CODE),
  //   mergeMap(() => this.indexedb.getById('status_code_id')),
  //   mergeMap((statusCode) => {
  //     if (statusCode) {
  //       return [SET_STATUS_CODE({ payload: statusCode.status_code })];
  //     } else {
  //       return this.appService.getStatusCode().pipe(
  //         map((statusCodes: any) => {
  //           if (statusCodes) {
  //             this.indexedb.create({ id: 'status_code_id', statusCodes });
  //           }
  //           return SET_STATUS_CODE({ payload: statusCodes });
  //         }),
  //         catchError((e) => {
  //           const source = { ...e, source: 'status_code' };
  //           return [SET_ERRORS({ payload: source })];
  //         })
  //       );
  //     }
  //   }),
  //   catchError((err) => of(err))
  // );
}
