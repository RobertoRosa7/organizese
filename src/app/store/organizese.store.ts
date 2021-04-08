import { ActionReducerMap } from '@ngrx/store';
import { reducerApp } from '../reducers/app.reducer';
import { reducerDashboard } from '../reducers/dashboard.reducer';
import { reducerErrors } from '../reducers/errors.reducer';
import { reducerLogin } from '../reducers/login.reducer';
import { reducerProfile } from '../reducers/profile.reducer';
import { reducer } from '../reducers/registers.reducer';

export const OrganizeseStore: ActionReducerMap<any> = {
  app: reducerApp,
  login: reducerLogin,
  profile: reducerProfile,
  registers: reducer,
  dashboard: reducerDashboard,
  http_error: reducerErrors,
};
