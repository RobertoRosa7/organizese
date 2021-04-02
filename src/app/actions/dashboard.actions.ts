import { createAction, props } from '@ngrx/store'

export enum actionsTypes {
  INIT_DASHBOARD = '[INIT_DASHBOARD]',

  GET_TOTALS = '[GET_TOTALS]',
  GET_DEV_MODE = '[GET_DEV_MODE]',

  FETCH_EVOLUCAO = '[FETCH_EVOLUCAO]',
  FETCH_EVOLUCAO_DESPESAS = '[FETCH_EVOLUCAO_DESPESAS]',
  FETCH_EVOLUCAO_DETAIL = '[FETCH_EVOLUCAO_DETAIL]',
  FETCH_GRAPH_CATEGORY = '[FETCH_GRAPH_CATEGORY]',
  FETCH_AUTOCOMPLETE = '[FETCH_AUTOCOMPLETE]',

  SET_AUTOCOMPLETE = '[SET_AUTOCOMPLETE]',
  SET_EVOLUCAO = '[SET_EVOLUCAO]',
  SET_EVOLUCAO_DESPESAS = '[SET_EVOLUCAO_DESPESAS]',
  SET_EVOLUCAO_DETAIL = '[SET_EVOLUCAO_DETAIL]',
  SET_GRAPH_CATEGORY = '[SET_GRAPH_CATEGORY]',
  SET_DEV_MODE = '[SET_DEV_MODE]',

  DARK_MODE = '[DARK_MODE]',
  UPDATE_AUTOCOMPLETE = '[UPDATE_AUTOCOMPLETE]',
}

export const INIT_DASHBOARD = createAction(actionsTypes.INIT_DASHBOARD)

export const FETCH_EVOLUCAO = createAction(actionsTypes.FETCH_EVOLUCAO)
export const FETCH_EVOLUCAO_DESPESAS = createAction(actionsTypes.FETCH_EVOLUCAO_DESPESAS)
export const FETCH_GRAPH_CATEGORY = createAction(actionsTypes.FETCH_GRAPH_CATEGORY)
export const FETCH_EVOLUCAO_DETAIL = createAction(actionsTypes.FETCH_EVOLUCAO_DETAIL, props<{ payload: any }>())
export const FETCH_AUTOCOMPLETE = createAction(actionsTypes.FETCH_AUTOCOMPLETE)

export const GET_TOTALS = createAction(actionsTypes.GET_TOTALS, props<{ payload: any }>())
export const GET_DEV_MODE = createAction(actionsTypes.GET_DEV_MODE, props<{ payload: any }>())

export const SET_DEV_MODE = createAction(actionsTypes.SET_DEV_MODE, props<{ payload: any }>())
export const SET_EVOLUCAO = createAction(actionsTypes.SET_EVOLUCAO, props<{ payload: any }>())
export const SET_EVOLUCAO_DESPESAS = createAction(actionsTypes.SET_EVOLUCAO_DESPESAS, props<{ payload: any }>())
export const SET_EVOLUCAO_DETAIL = createAction(actionsTypes.SET_EVOLUCAO_DETAIL, props<{ payload: any }>())
export const SET_GRAPH_CATEGORY = createAction(actionsTypes.SET_GRAPH_CATEGORY, props<{ payload: any }>())
export const SET_AUTOCOMPLETE = createAction(actionsTypes.SET_AUTOCOMPLETE, props<{ payload: any }>())

export const DARK_MODE = createAction(actionsTypes.DARK_MODE, props<{ payload: any }>())
export const UPDATE_AUTOCOMPLETE = createAction(actionsTypes.UPDATE_AUTOCOMPLETE)
