import { createReducer, on } from '@ngrx/store';
import * as actionsApp from '../actions/app.actions';
import * as actions from '../actions/login.actions';

const INITIAL_STATES = {
  token: '',
  cadastro: false,
  created_user: false,
  logged_user: false,
};

const appReducer = createReducer(
  INITIAL_STATES,
  on(actions.CREATED_USER, (states, { payload }) => ({
    ...states,
    created_user: payload,
  })),
  on(actions.LOGGED_USER, (states, { payload }) => ({
    ...states,
    logged_user: payload,
  })),
  on(actions.SET_USER, (states, { payload }) => ({
    ...states,
    token: payload,
  })),

  on(actions.RESET, (states) => ({ ...states, token: '', logged_user: false })),
  on(actionsApp.RESET_ALL, (states) => ({
    ...states,
    token: '',
    cadastro: false,
    created_user: false,
    logged_user: false,
  }))
);

export function reducerLogin(state: any, action: any): any {
  return appReducer(state, action);
}
