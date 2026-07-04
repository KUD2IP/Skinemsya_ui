import {
  DEFAULT_PHONE_COUNTRY_ID,
  getPhoneCountry,
  nationalLengthBounds,
  phoneCountriesByDialCodeDesc,
} from './phoneCountries';

/** Цифры из строки (только 0-9). */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Нормализует российский номер к виду +79001234567 (≤20 символов для бэка).
 * @deprecated Используйте normalizeInternationalPhone
 */
export function normalizeRuPhone(raw: string): string | null {
  const digits = digitsOnly(raw);
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    return `+7${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `+7${digits}`;
  }
  return null;
}

/** @deprecated Используйте isValidInternationalPhone */
export function isValidRuPhone(raw: string): boolean {
  return normalizeRuPhone(raw) !== null;
}

export interface PhoneParts {
  countryId: string;
  national: string;
}

/** Собирает E.164 из кода страны и национальной части. */
export function normalizeInternationalPhone(countryId: string, national: string): string | null {
  const country = getPhoneCountry(countryId);
  const natDigits = digitsOnly(national);
  if (!natDigits) return null;

  const { min, max } = nationalLengthBounds(country);
  if (natDigits.length < min || natDigits.length > max) return null;

  const codeDigits = digitsOnly(country.dialCode);
  const e164 = `+${codeDigits}${natDigits}`;
  if (e164.length > 20) return null;
  if (!/^\+\d{8,15}$/.test(e164)) return null;

  return e164;
}

export function isValidInternationalPhone(countryId: string, national: string): boolean {
  return normalizeInternationalPhone(countryId, national) !== null;
}

/** Разбирает сохранённый номер (+79001234567) на страну и национальную часть. */
export function parseStoredPhone(phone: string | null | undefined): PhoneParts {
  if (!phone?.trim()) {
    return { countryId: DEFAULT_PHONE_COUNTRY_ID, national: '' };
  }

  const digits = digitsOnly(phone);
  if (!digits) {
    return { countryId: DEFAULT_PHONE_COUNTRY_ID, national: '' };
  }

  for (const country of phoneCountriesByDialCodeDesc()) {
    const codeDigits = digitsOnly(country.dialCode);
    if (!digits.startsWith(codeDigits)) continue;

    const national = digits.slice(codeDigits.length);
    if (national.length === 0) continue;

    // +7: уточняем RU/KZ по префиксу национальной части
    if (country.dialCode === '+7' && codeDigits === '7') {
      if (national.startsWith('7')) {
        return { countryId: 'KZ', national };
      }
      return { countryId: 'RU', national };
    }

    return { countryId: country.id, national };
  }

  // Фолбэк: старые номера без +
  const ru = normalizeRuPhone(phone);
  if (ru) {
    return { countryId: 'RU', national: digitsOnly(ru).slice(1) };
  }

  return { countryId: DEFAULT_PHONE_COUNTRY_ID, national: digitsOnly(phone) };
}

import { validateCard as runValidateCard } from './cardValidation';

/** Строка похожа на номер карты (только цифры, пробелы, дефисы). */
export function isCardLike(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (!/^[\d\s-]+$/.test(trimmed)) return false;
  const digits = digitsOnly(trimmed);
  return digits.length >= 13;
}

export {
  validateCard,
  formatCardNumber,
  detectCardBrand,
  maxCardDigits,
  isValidPaymentDetails,
  CARD_BRAND_LABELS,
  CARD_BRAND_SHORT_LABELS,
  SUPPORTED_CARD_BRANDS,
} from './cardValidation';
export type { CardBrand, CardValidationResult } from './cardValidation';

/** @deprecated Используйте validateCard */
export function isValidCardNumber(raw: string): boolean {
  return runValidateCard(raw).valid;
}
