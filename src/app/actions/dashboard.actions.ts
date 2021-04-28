import { createAction, props } from '@ngrx/store';

export enum actionsTypes {
  INIT_DASHBOARD = '[INIT_DASHBOARD]',

  GET_TOTALS = '[GET_TOTALS]',
  GET_DEV_MODE = '[GET_DEV_MODE]',

  FETCH_DASHBOARD = '[FETCH_DASHBOARD]',
  FETCH_EVOLUCAO = '[FETCH_EVOLUCAO]',
  FETCH_EVOLUCAO_DESPESAS = '[FETCH_EVOLUCAO_DESPESAS]',
  FETCH_EVOLUCAO_DETAIL = '[FETCH_EVOLUCAO_DETAIL]',
  FETCH_GRAPH_CATEGORY = '[FETCH_GRAPH_CATEGORY]',
  FETCH_GRAPH_OUTCOME_INCOME = '[FETCH_GRAPH_OUTCOME_INCOME]',
  FETCH_AUTOCOMPLETE = '[FETCH_AUTOCOMPLETE]',
  FETCH_DATES = '[FETCH_DATES]',
  FETCH_LASTDATE_OUTCOME = 'FETCH_LASTDATE_OUTCOME',

  SET_AUTOCOMPLETE = '[SET_AUTOCOMPLETE]',
  SET_EVOLUCAO = '[SET_EVOLUCAO]',
  SET_EVOLUCAO_DESPESAS = '[SET_EVOLUCAO_DESPESAS]',
  SET_EVOLUCAO_DETAIL = '[SET_EVOLUCAO_DETAIL]',
  SET_GRAPH_CATEGORY = '[SET_GRAPH_CATEGORY]',
  SET_GRAPH_OUTCOME_INCOME = '[SET_GRAPH_OUTCOME_INCOME]',
  SET_DEV_MODE = '[SET_DEV_MODE]',
  SET_DATES = '[SET_DATES]',
  SET_DASHBOARD = '[SET_DASHBOARD]',
  SET_LASTDATE_OUTCOME = '[SET_LASTDATE_OUTCOME]',

  PUT_GRAPH_OUTCOME_INCOME = '[PUT_GRAPH_OUTCOME_INCOME]',
  PUT_LASTDATE_OUTCOME = '[PUT_LASTDATE_OUTCOME]',
  PUT_CONSOLIDADO = '[PUT_CONSOLIDADO]',
  PUT_DASHBOARD = '[PUT_DASHBOARD]',

  DARK_MODE = '[DARK_MODE]',
  UPDATE_AUTOCOMPLETE = '[UPDATE_AUTOCOMPLETE]',
}

export const INIT_DASHBOARD = createAction(actionsTypes.INIT_DASHBOARD);
export const FETCH_DASHBOARD = createAction(actionsTypes.FETCH_DASHBOARD);
export const FETCH_EVOLUCAO = createAction(actionsTypes.FETCH_EVOLUCAO);

export const FETCH_EVOLUCAO_DESPESAS = createAction(
  actionsTypes.FETCH_EVOLUCAO_DESPESAS
);
export const FETCH_GRAPH_CATEGORY = createAction(
  actionsTypes.FETCH_GRAPH_CATEGORY
);
export const FETCH_GRAPH_OUTCOME_INCOME = createAction(
  actionsTypes.FETCH_GRAPH_OUTCOME_INCOME
);
export const FETCH_LASTDATE_OUTCOME = createAction(
  actionsTypes.FETCH_LASTDATE_OUTCOME
);
export const FETCH_EVOLUCAO_DETAIL = createAction(
  actionsTypes.FETCH_EVOLUCAO_DETAIL,
  props<{ payload: any }>()
);
export const FETCH_AUTOCOMPLETE = createAction(actionsTypes.FETCH_AUTOCOMPLETE);
export const FETCH_DATES = createAction(
  actionsTypes.FETCH_DATES,
  props<{ payload: any }>()
);

export const GET_TOTALS = createAction(
  actionsTypes.GET_TOTALS,
  props<{ payload: any }>()
);
export const GET_DEV_MODE = createAction(
  actionsTypes.GET_DEV_MODE,
  props<{ payload: any }>()
);

export const SET_DEV_MODE = createAction(
  actionsTypes.SET_DEV_MODE,
  props<{ payload: any }>()
);
export const SET_EVOLUCAO = createAction(
  actionsTypes.SET_EVOLUCAO,
  props<{ payload: any }>()
);
export const SET_EVOLUCAO_DESPESAS = createAction(
  actionsTypes.SET_EVOLUCAO_DESPESAS,
  props<{ payload: any }>()
);
export const SET_EVOLUCAO_DETAIL = createAction(
  actionsTypes.SET_EVOLUCAO_DETAIL,
  props<{ payload: any }>()
);
export const SET_GRAPH_CATEGORY = createAction(
  actionsTypes.SET_GRAPH_CATEGORY,
  props<{ payload: any }>()
);
export const SET_GRAPH_OUTCOME_INCOME = createAction(
  actionsTypes.SET_GRAPH_OUTCOME_INCOME,
  props<{ payload: any }>()
);
export const SET_AUTOCOMPLETE = createAction(
  actionsTypes.SET_AUTOCOMPLETE,
  props<{ payload: any }>()
);
export const SET_DASHBOARD = createAction(
  actionsTypes.SET_DASHBOARD,
  props<{ payload: any }>()
);
export const SET_LASTDATE_OUTCOME = createAction(
  actionsTypes.SET_LASTDATE_OUTCOME,
  props<{ payload: any }>()
);

export const DARK_MODE = createAction(
  actionsTypes.DARK_MODE,
  props<{ payload: any }>()
);

export const PUT_CONSOLIDADO = createAction(actionsTypes.PUT_CONSOLIDADO);
export const PUT_DASHBOARD = createAction(actionsTypes.PUT_DASHBOARD);
export const PUT_GRAPH_OUTCOME_INCOME = createAction(
  actionsTypes.PUT_GRAPH_OUTCOME_INCOME
);
export const PUT_LASTDATE_OUTCOME = createAction(
  actionsTypes.PUT_LASTDATE_OUTCOME
);

export const UPDATE_AUTOCOMPLETE = createAction(
  actionsTypes.UPDATE_AUTOCOMPLETE
);
