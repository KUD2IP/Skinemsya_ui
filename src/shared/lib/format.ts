import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { DebtStatus, EventStatus, GroupType, PaymentStatus } from '@/shared/api/dto';
import { getPhoneCountry } from './phoneCountries';
import { parseStoredPhone } from './validation';

/** Форматирование суммы в рублях. Принимает kopecks (как Money на бэке). */
export function formatMoney(kopecks: number, currency = '₽'): string {
  const rubles = kopecks / 100;
  const formatted = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: rubles % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(rubles);
  return `${formatted}\u00A0${currency}`;
}

/** Форматирование телефона для отображения. */
export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return '';
  const { countryId, national } = parseStoredPhone(raw);
  if (!national) return raw;
  const country = getPhoneCountry(countryId);
  return `${country.dialCode} ${national}`;
}

/** Инициалы из отображаемого имени для аватара-фолбэка. */
export function initials(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name
    .trim()
    .split(/\s+/)
    .map((part) => part.replace(/[^a-zA-Zа-яА-ЯёЁ0-9]/g, ''))
    .filter(Boolean)
    .slice(0, 2);
  const result = parts.map((p) => p[0]?.toUpperCase() ?? '').join('');
  return result || '?';
}

const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  DRAFT: 'Создаётся',
  DISTRIBUTION: 'Создан',
  CALCULATED: 'Создан',
  COMPLETED: 'Закрыт',
};

const DEBT_STATUS_LABELS: Record<DebtStatus, string> = {
  UNPAID: 'Не скинул',
  PENDING_CONFIRMATION: 'Ждёт проверки',
  PAID: 'Подтверждено',
};

const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  CREATED: 'Не отправлено',
  DEBTOR_CONFIRMED: 'Ждёт проверки',
  PAYER_CONFIRMED: 'Подтверждено',
  CANCELLED: 'Отменено',
  DISPUTED: 'Не пришло',
};

const GROUP_TYPE_LABELS: Record<GroupType, string> = {
  STANDALONE: 'Своя группа',
  CHAT_LINKED: 'Из чата',
};

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
    .format(date)
    .replace(/\sг\.,\s/u, ' г. ');
}

/** Относительное время («3 дня назад»). */
export function formatRelativeTime(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ru });
}

/** Компактное время для списков («23 ч», «1 дн»). */
export function formatRelativeTimeShort(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 60_000) return 'сейчас';
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} дн`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} нед`;
  return formatRelativeTime(iso);
}

/** Детерминированный тон аватара (0–3) из строки-сида. */
export function avatarToneFromSeed(seed: string): 0 | 1 | 2 | 3 {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return (hash % 4) as 0 | 1 | 2 | 3;
}

export function eventStatusLabel(status: EventStatus): string {
  return EVENT_STATUS_LABELS[status];
}

export function debtStatusLabel(status: DebtStatus | string): string {
  if (status in DEBT_STATUS_LABELS) {
    return DEBT_STATUS_LABELS[status as DebtStatus];
  }
  if (status === 'NONE') return 'Ещё не зашёл';
  return status;
}

export function paymentStatusLabel(status: PaymentStatus): string {
  return PAYMENT_STATUS_LABELS[status];
}

export function groupTypeLabel(type: GroupType): string {
  return GROUP_TYPE_LABELS[type];
}

/** Конвертация рублей (строка/число) в копейки для API. */
export function rublesToKopecks(value: string | number): number {
  const normalized = typeof value === 'number' ? value : Number(value.replace(',', '.').trim());
  if (!Number.isFinite(normalized) || normalized < 0) return 0;
  return Math.round(normalized * 100);
}

/** Цена за единицу позиции в копейках. */
export function positionUnitPriceKopecks(position: { quantity: number; totalPriceKopecks: number }): number {
  if (position.quantity <= 0) return position.totalPriceKopecks;
  return Math.round(position.totalPriceKopecks / position.quantity);
}
