import { Register } from '../models/models';

export function updateAll(all: any): any {
  return all.map((s: Register) => ({
    ...s,
    status: statusTrans(s.status, s.type),
    cat_icon: returnIcon(s.category),
  }));
}

export function total(lista: any): any {
  const totals: any = { despesa: 0, receita: 0 };

  lista.forEach((v: any) => {
    if (v.type === 'outcoming') {
      totals.despesa += v.value;
    } else if (v.type === 'incoming') {
      totals.receita += v.value;
    }
  });
  return totals;
}

export function returnIcon(text: string = ''): string {
  switch (cleanText(text)) {
    case 'alimentacao':
      return 'restaurant';
    case 'transporte':
      return 'train';
    case 'banco':
      return 'account_balance';
    case 'trabalho':
      return 'work_outline';
    case 'vestuario':
      return 'checkroom';
    case 'outros':
      return 'drag_indicator';
    case 'pessoal':
      return 'perm_identity';
    case 'internet':
      return 'swap_vert';
    case 'agua_e_luz':
      return 'payment';
    default:
      return 'drag_indicator';
  }
}

export function statusTrans(text: string = '', type: string): string {
  switch (text) {
    case 'pending':
    case 'pendente a pagar':
    case 'pendente a receber':
      return type === 'incoming' ? 'pendente a receber' : 'pendente a pagar';
    case 'done':
    case 'concluído':
      return 'concluído';
    default:
      return 'pendente';
  }
}

export function cleanText(text: string | undefined = ''): string {
  return text
    .toLowerCase()
    .replace(' ', '_')
    .replace('&', 'e')
    .replace('á', 'a')
    .replace('ã', 'a')
    .replace('ç', 'c')
    .replace('õ', 'o');
}

export function formatDataToGraphCategory(payload: any): any {
  return Object.values(payload.category)
    .map((v: any) => ({ name: v, sliced: true }))
    .map((v: any, index) => ({
      ...v,
      total: abstract(payload.total, index),
    }))
    .map((val: any, index) => ({
      ...val,
      name: val.name,
      y: abstract(payload.each_percent, index),
    }));
}

function abstract(payload: any, index: number): any {
  return Object.values(payload).map((v: any) => ({ v }))[index].v;
}

export function formatterOutcomeIncome(payload: any): any {
  return payload.outcome_income.map((value: any) => ({
    ...value,
    name: value.name === 'incoming' ? 'Entrada' : 'Saída',
    dates: value.dates.map((date: any) => new Date(date).getTime()),
    data: value.values,
    color:
      value.name === 'incoming'
        ? 'var(--green-microsoft)'
        : 'var(--text-accent)',
  }));
}
