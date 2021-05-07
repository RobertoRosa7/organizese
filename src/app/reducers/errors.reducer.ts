import { createReducer, on } from '@ngrx/store';
import * as actionsApp from '../actions/app.actions';
import * as actions from '../actions/errors.actions';

const INITIAL_STATES = {
  error: {},
  status_code: [],
  success: '',
};

const errorsReducers = createReducer(
  INITIAL_STATES,
  on(actions.SET_ERRORS, (states, { payload }) => ({
    ...states,
    error: payload,
  })),
  on(actions.SET_SUCCESS, (states, { payload }) => ({
    ...states,
    success: payload,
  })),
  on(actions.RESET_ERRORS, (states) => ({ ...states, error: {} })),
  on(actionsApp.RESET_ALL, (states) => ({
    ...states,
    error: {},
    status_code: [],
    success: '',
  }))
);

export const reducerErrors = (state: any, action: any): any =>
  errorsReducers(state, action);
