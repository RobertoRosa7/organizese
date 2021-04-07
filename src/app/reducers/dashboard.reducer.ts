import { createReducer, on } from '@ngrx/store';
import * as moment from 'moment';
import * as actionsApp from '../actions/app.actions';
import * as actions from '../actions/dashboard.actions';
import * as utils from './utils.reducer';

const BASE = {
  consolidado: {
    total_credit: 0,
    total_debit: 0,
    total_consolidado: 0,
    percent_consolidado: 0,
    percent_debit: 0,
    percent_credit: 0,
    a_pagar: 0,
    a_receber: 0
  },
  registers: [],
  dark_mode: '',
  mode: '',
  evolucao: {},
  evolucao_detail: {},
  evolucao_despesas: {},
  auto_complete: [],
  graph_category: [],
  dates: {
    type: 'default',
    category: {
      dt_start: moment().subtract(31, 'days'),
      dt_end: moment(new Date())
    },
    outcome: {
      dt_start: moment().subtract(31, 'days'),
      dt_end: moment(new Date())
    },
    income: {
      dt_start: moment().subtract(31, 'days'),
      dt_end: moment(new Date())
    },
    default: {
      dt_start: moment().subtract(31, 'days'),
      dt_end: moment(new Date())
    }
  }
}

const INITIAL_STATES = BASE;

const dashboardReducers = createReducer(
  INITIAL_STATES,
  on(actions.GET_TOTALS, (states, { payload }) => ({ ...states, consolidado: payload })),
  on(actions.DARK_MODE, (states, { payload }) => ({ ...states, dark_mode: payload })),
  on(actions.SET_EVOLUCAO, (states, { payload }) => ({ ...states, evolucao: payload })),
  on(actions.SET_EVOLUCAO_DETAIL, (states, { payload }) => ({ ...states, evolucao_detail: payload })),
  on(actions.SET_DEV_MODE, (states, { payload }) => ({ ...states, mode: payload.mode })),
  on(actions.SET_EVOLUCAO_DESPESAS, (states, { payload }) => ({ ...states, evolucao_despesas: payload })),
  on(actions.SET_AUTOCOMPLETE, (states, { payload }) => ({ ...states, auto_complete: payload })),
  on(actions.FETCH_DATES, (states, { payload }) => ({ ...states, dates: payload })),

  on(actions.SET_DASHBOARD, (states, { payload }) => {
    const totals: any = utils.total(payload.data.results);
    console.log(payload);
    return ({
      ...states,
      registers: payload.data.results.length > 0 ? utils.updateAll(payload.data.results) : [],
      // consolidado: payload.data.consolidado,
      total: payload.data.total,
      total_geral: payload.data.total_geral,
      total_despesas: totals.despesa,
      total_receita: totals.receita,
      a_pagar: payload.data.consolidado.a_pagar,
      a_receber: payload.data.consolidado.a_receber,
      all_days_period: payload.data.days <= 0 ? 1 : payload.data.days
    });
  }),

  on(actions.SET_GRAPH_CATEGORY, (states, { payload }) => {
    const payloadFormated: any = utils.formatDataToGraphCategory({ ...payload })
    return ({
      ...states,
      graph_category: payloadFormated
    })
  }),
  on(actionsApp.RESET_ALL, (states) => ({ ...states, BASE }))
);

export function reducerDashboard(state: any, action: any): any {
  return dashboardReducers(state, action);
}