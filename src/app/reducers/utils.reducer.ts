import { Register } from '../models/models';

export function updateAll(all: any) {
  return all.map((s: Register) => ({
    ...s,
    status: statusTrans(s.status, s.type),
    cat_icon: returnIcon(s.category),
  }));
}

export function total(lista: any) {
  const total: any = { despesa: 0, receita: 0 };
  lista.forEach((v: any) => {
    if (v.type === 'outcoming') {
      total['despesa'] += v.value;
    } else if (v.type === 'incoming') {
      total['receita'] += v.value;
    }
  });
  return total;
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

export function statusTrans(text: string = '', type: string) {
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

export function formatDataToGraphCategory(payload: any) {
  return Object.values(payload.category)
    .map((v: any) => ({ name: v, sliced: true }))
    .map((val: any, i) => ({
      ...val,
      name: val.name,
      y: Object.values(payload.each_percent).map((v: any) => ({ v: v }))[i].v,
    }));
}
