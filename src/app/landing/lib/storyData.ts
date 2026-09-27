/**
 * Данные одного сквозного примера: ужин на четверых.
 * Все суммы на лендинге берутся отсюда, чтобы чек, экраны и итоги сходились.
 * Суммы — в копейках (как в formatMoney).
 */

export const DINNER = {
  clock: '21:40',
  when: 'Пятница, 21:40',
  title: 'Пятница · Суши',
  payer: 'Марк',
  guests: 4,
  total: 486_000,
} as const;

export interface DinnerItem {
  name: string;
  qty: number;
  unit: number;
  total: number;
  shared?: boolean;
}

export const DINNER_ITEMS: DinnerItem[] = [
  { name: 'Калифорния', qty: 2, unit: 42_000, total: 84_000 },
  { name: 'Филадельфия', qty: 2, unit: 52_000, total: 104_000 },
  { name: 'Рамен', qty: 1, unit: 69_000, total: 69_000 },
  { name: 'Гёдза', qty: 2, unit: 34_000, total: 68_000 },
  { name: 'Салат чука', qty: 1, unit: 39_000, total: 39_000 },
  { name: 'Мисо-суп', qty: 3, unit: 18_000, total: 54_000 },
  { name: 'Зелёный чай', qty: 2, unit: 24_000, total: 48_000, shared: true },
  { name: 'Мороженое', qty: 1, unit: 20_000, total: 20_000 },
];

/** Доля общего (чай) на каждого участника. */
export const SHARED_PER_GUEST = 12_000;

export interface DinnerShare {
  name: string;
  amount: number;
}

/** Итог каждого участника: свои позиции + доля общего. Сумма равна DINNER.total. */
export const DINNER_SHARES: DinnerShare[] = [
  { name: 'Марк', amount: 151_000 },
  { name: 'Аня', amount: 148_000 },
  { name: 'Боря', amount: 155_000 },
  { name: 'Кира', amount: 32_000 },
];

/** Переводы плательщику — все участники, кроме него самого. */
export const DINNER_TRANSFERS = DINNER_SHARES.filter((share) => share.name !== DINNER.payer);

/** Сколько собирают плательщику суммарно. */
export const DINNER_TRANSFERS_TOTAL = DINNER_TRANSFERS.reduce(
  (sum, share) => sum + share.amount,
  0,
);
