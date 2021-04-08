import { createAction, props } from '@ngrx/store';

export enum actionsTypes {
  INIT = '[INIT]',
  ADD_REGISTERS = '[ADD_REGISTERS]',
  ADDED_REGISTERS = '[ADDED_REGISTERS]',
  UPDATE_REGISTER = '[UPDATE_REGISTER]',
  DELETE_REGISTERS = '[DELETE_REGISTERS]',

  GET_REGISTERS = '[GET_REGISTERS]',
  GET_TAB = '[GET_TAB]',
  GET_SHOWTAB = '[GET_SHOWTAB]',
  GET_SEARCH = '[GET_SEARCH]',

  SET_SHOWTAB = '[SET_SHOWTAB]',
  SET_REGISTERS = '[SET_REGISTERS]',
  SET_UPDATE = '[SET_UPDATE]',
  SET_SEARCH = '[SET_SEARCH]',
}
export const INIT = createAction(actionsTypes.INIT, (payload: any) => payload);

export const ADD_REGISTERS = createAction(
  actionsTypes.ADD_REGISTERS,
  props<{ payload: any }>()
);
export const ADDED_REGISTERS = createAction(
  actionsTypes.ADDED_REGISTERS,
  props<{ payload: any }>()
);
export const UPDATE_REGISTER = createAction(
  actionsTypes.UPDATE_REGISTER,
  props<{ payload: any }>()
);

export const SET_REGISTERS = createAction(
  actionsTypes.SET_REGISTERS,
  props<{ payload: any }>()
);
export const SET_SHOWTAB = createAction(
  actionsTypes.SET_SHOWTAB,
  props<{ payload: any }>()
);
export const SET_UPDATE = createAction(
  actionsTypes.SET_UPDATE,
  props<{ payload: any }>()
);
export const SET_SEARCH = createAction(
  actionsTypes.SET_SEARCH,
  props<{ payload: any }>()
);

export const GET_REGISTERS = createAction(
  actionsTypes.GET_REGISTERS,
  props<{ payload: any }>()
);
export const GET_TAB = createAction(
  actionsTypes.GET_TAB,
  props<{ payload: any }>()
);
export const GET_SHOWTAB = createAction(
  actionsTypes.GET_SHOWTAB,
  props<{ payload: any }>()
);
export const GET_SEARCH = createAction(
  actionsTypes.GET_SEARCH,
  props<{ payload: any }>()
);

export const DELETE_REGISTERS = createAction(
  actionsTypes.DELETE_REGISTERS,
  props<{ payload: any }>()
);
