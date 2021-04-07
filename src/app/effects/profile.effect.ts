import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { SET_ERRORS } from '../actions/errors.actions';
import * as actionsProfile from '../actions/profile.actions';
import { ProfileService } from '../services/profile.service';

@Injectable()
export class ProfileEffect {
  constructor(
    private action: Actions,
    private profileService: ProfileService
  ) {}

  @Effect()
  public updateProfile$: Observable<Actions> = this.action.pipe(
    ofType(actionsProfile.LISTENING_PROFILE),
    mergeMap(({ payload }) =>
      this.profileService.profileUpdate(payload).pipe(catchError((e) => of(e)))
    ),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'update_profile' };
        return SET_ERRORS({ payload: source });
      } else {
        return actionsProfile.SET_PROFILE({ payload });
      }
    }),
    catchError((err) => of(err))
  );

  @Effect()
  public getProfile$: Observable<Actions> = this.action.pipe(
    ofType(actionsProfile.GET_PROFILE),
    mergeMap(() =>
      this.profileService.profileGet().pipe(catchError((e) => of(e)))
    ),
    map((payload) => {
      if (payload instanceof HttpErrorResponse) {
        const source = { ...payload, source: 'get_profile' };
        return SET_ERRORS({ payload: source });
      } else {
        return actionsProfile.SET_PROFILE({ payload });
      }
    }),
    catchError((err) => of(err))
  );
}
