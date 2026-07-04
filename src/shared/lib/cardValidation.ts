import { digitsOnly } from './validation';

export type CardBrand = 'mir' | 'visa' | 'mastercard' | 'amex' | 'unionpay' | 'unknown';

export const CARD_BRAND_LABELS: Record<CardBrand, string> = {
  mir: 'Мир',
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'American Express',
  unionpay: 'UnionPay',
  unknown: 'Карта',
};

/** Платёжные системы, которые принимаем в поле карты. */
export const SUPPORTED_CARD_BRANDS = [
  'mir',
  'visa',
  'mastercard',
  'amex',
  'unionpay',
] as const satisfies readonly CardBrand[];

/** Короткие подписи для бейджей в UI. */
export const CARD_BRAND_SHORT_LABELS: Record<(typeof SUPPORTED_CARD_BRANDS)[number], string> = {
  mir: 'Мир',
  visa: 'Visa',
  mastercard: 'MC',
  amex: 'AmEx',
  unionpay: 'UnionPay',
};

/** Определяет платёжную систему по BIN (первым цифрам). */
export function detectCardBrand(digits: string): CardBrand {
  if (!digits) return 'unknown';
  if (/^220[0-4]/.test(digits)) return 'mir';
  if (/^4/.test(digits)) return 'visa';
  if (/^3[47]/.test(digits)) return 'amex';
  if (/^62/.test(digits)) return 'unionpay';
  if (/^5[1-5]/.test(digits) || /^2(2[2-9]|[3-6]|7[01]|720)/.test(digits)) return 'mastercard';
  return 'unknown';
}

function luhnCheck(digits: string): boolean {
  if (!/^\d+$/.test(digits)) return false;
  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function expectedLengths(brand: CardBrand): number[] {
  switch (brand) {
    case 'amex':
      return [15];
    case 'visa':
      return [13, 16, 19];
    case 'mir':
    case 'mastercard':
      return [16];
    case 'unionpay':
      return [16, 17, 18, 19];
    default:
      return [13, 14, 15, 16, 17, 18, 19];
  }
}

/** Максимум цифр, которые можно ввести для текущего BIN. */
export function maxCardDigits(digits: string): number {
  const brand = detectCardBrand(digits);

  switch (brand) {
    case 'amex':
      return 15;
    case 'mir':
    case 'mastercard':
      return 16;
    case 'visa':
    case 'unionpay':
      return 19;
    default: {
      const d = digitsOnly(digits);
      if (/^3/.test(d)) return 15;
      if (/^4/.test(d)) return 19;
      if (/^5/.test(d) || /^2/.test(d)) return 16;
      if (/^220/.test(d)) return 16;
      if (/^62/.test(d)) return 19;
      return 19;
    }
  }
}

export interface CardValidationResult {
  valid: boolean;
  brand: CardBrand;
  digits: string;
  formatted: string;
  error?: string;
}

/** Форматирует номер карты группами по 4 цифры (AmEx — 4-6-5). Обрезает лишние цифры. */
export function formatCardNumber(raw: string): string {
  const all = digitsOnly(raw);
  const digits = all.slice(0, maxCardDigits(all));
  const brand = detectCardBrand(digits);
  if (brand === 'amex') {
    const p = [digits.slice(0, 4), digits.slice(4, 10), digits.slice(10, 15)].filter(Boolean);
    return p.join(' ');
  }
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/** Полная проверка номера карты: BIN, длина, алгоритм Луна. */
export function validateCard(raw: string): CardValidationResult {
  const digits = digitsOnly(raw);
  const brand = detectCardBrand(digits);
  const formatted = formatCardNumber(digits);

  if (!digits) {
    return { valid: true, brand: 'unknown', digits: '', formatted: '' };
  }

  if (digits.length < 13) {
    return {
      valid: false,
      brand,
      digits,
      formatted,
      error: 'Введите полный номер карты',
    };
  }

  const allowed = expectedLengths(brand);
  if (!allowed.includes(digits.length)) {
    const label = CARD_BRAND_LABELS[brand];
    const lenHint =
      allowed.length === 1 ? `${allowed[0]} цифр` : `${allowed.join(' или ')} цифр`;
    return {
      valid: false,
      brand,
      digits,
      formatted,
      error: `${label}: номер должен содержать ${lenHint}`,
    };
  }

  if (!luhnCheck(digits)) {
    return {
      valid: false,
      brand,
      digits,
      formatted,
      error: 'Неверный номер карты. Проверьте цифры',
    };
  }

  return { valid: true, brand, digits, formatted };
}

export function isValidPaymentDetails(raw: string): boolean {
  const trimmed = raw.trim();
  if (!trimmed) return true;
  const digits = digitsOnly(trimmed);
  if (digits.length >= 13 && /^[\d\s-]+$/.test(trimmed)) {
    return validateCard(trimmed).valid;
  }
  return true;
}
