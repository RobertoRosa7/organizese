import { createReducer, on } from '@ngrx/store';
import * as actions from '../actions/registers.actions';
import * as actionsApp from '../actions/app.actions';
import * as utils from './utils.reducer';

const categories: string[] = [
  'Banco',
  'Alimentação',
  'Vestuário',
  'Transporte',
  'Água & Luz',
  'Internet',
  'Pessoal',
  'Trabalho',
].sort();

const tabList: string[] = [
  'read',
  'create',
  'print',
  'profile',
  'new_password',
  'theme',
  'about',
  'account',
];

const INITIAL_STATE = {
  all: [],
  tab: '',
  visible: {},
  consolidado: {},
  msg: '',
  total: 0,
  total_geral: 0,
  categories,
  total_despesas: 0,
  total_receita: 0,
  a_receber: 0,
  a_pagar: 0,
  all_days_period: 1,
  result_search: [],
  tabList: tabList,
};
const registersReducers = createReducer(
  INITIAL_STATE,
  on(actions.SET_REGISTERS, (states, { payload }) => ({
    ...states,
    all: states.all.concat(payload),
  })),
  on(actions.GET_REGISTERS, (states, { payload }) => {
    const totals: any = utils.total(payload.data.results);
    return {
      ...states,
      all:
        payload.data.results.length > 0
          ? utils.updateAll(payload.data.results)
          : [],
      consolidado: payload.data.consolidado,
      msg: payload.msg,
      total: payload.data.total,
      total_geral: payload.data.total_geral,
      total_despesas: totals.despesa,
      total_receita: totals.receita,
      a_pagar: payload.data.consolidado.a_pagar,
      a_receber: payload.data.consolidado.a_receber,
      all_days_period: payload.data.days <= 0 ? 1 : payload.data.days,
    };
  }),
  on(actions.GET_TAB, (states, { payload }) => ({ ...states, tab: payload })),
  on(actions.SET_SHOWTAB, (states, { payload }) => ({
    ...states,
    visible: payload,
  })),
  on(actions.SET_UPDATE, (states, { payload }) => {
    const stateUpdated: any = [...states.all];
    stateUpdated[
      stateUpdated.findIndex((r: any) => r._id.$oid === payload._id.$oid)
    ] = payload;
    return { ...states, all: utils.updateAll(stateUpdated) };
  }),
  on(actions.SET_SEARCH, (states, { payload }) => ({
    ...states,
    result_search: utils.updateAll(payload),
  })),

  on(actionsApp.RESET_ALL, (states) => ({
    ...states,
    all: utils.updateAll([]),
    tab: '',
    visible: {},
    consolidado: {},
    msg: '',
    total: 0,
    total_despesas: 0,
    categories,
    a_pagar: 0,
    a_receber: 0,
    all_days_period: 1,
    result_search: [],
  }))
);

export function reducer(state: any, action: any) {
  return registersReducers(state, action);
}
