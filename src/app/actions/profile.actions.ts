import { createAction, props } from '@ngrx/store';

export enum actionsTypes {
  LISTENING_PROFILE = '[LISTENING_PROFILE]',
  SET_PROFILE = '[SET_PROFILE]',
  GET_PROFILE = '[GET_PROFILE]',
}

export const LISTENING_PROFILE = createAction(
  actionsTypes.LISTENING_PROFILE,
  props<{ payload: any }>()
);
export const SET_PROFILE = createAction(
  actionsTypes.SET_PROFILE,
  props<{ payload: any }>()
);
export const GET_PROFILE = createAction(actionsTypes.GET_PROFILE);
