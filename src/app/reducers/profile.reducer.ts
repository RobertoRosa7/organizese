import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/profile.actions';
import * as actionsApp from '../actions/app.actions';

const INITIAL_STATES = {
  user: {},
};

const profileReducer = createReducer(
  INITIAL_STATES,
  on(actions.SET_PROFILE, (states, { payload }) => ({
    ...states,
    user: payload,
  })),

  on(actionsApp.RESET_ALL, (states) => ({ ...states, user: {} }))
);

export function reducerProfile(state: any, action: any) {
  return profileReducer(state, action);
}
