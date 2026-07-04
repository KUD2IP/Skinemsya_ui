import { PHONE_COUNTRIES_DATA } from './phoneCountries.data';

/** Справочник стран для телефонного ввода. */
export interface PhoneCountry {
  id: string;
  name: string;
  dialCode: string;
  /** Emoji-флаг по ISO 3166-1 alpha-2. */
  flag: string;
  /** Пример национальной части (без кода страны). */
  example: string;
  /** Допустимая длина национального номера (цифры). */
  nationalLength: number | readonly [number, number];
}

export const PHONE_COUNTRIES = PHONE_COUNTRIES_DATA as readonly PhoneCountry[];

export const DEFAULT_PHONE_COUNTRY_ID = 'RU';

export function getPhoneCountry(id: string): PhoneCountry {
  return PHONE_COUNTRIES.find((c) => c.id === id) ?? PHONE_COUNTRIES[0];
}

export function phoneCountriesByDialCodeDesc(): PhoneCountry[] {
  return [...PHONE_COUNTRIES].sort(
    (a, b) => b.dialCode.replace(/\D/g, '').length - a.dialCode.replace(/\D/g, '').length,
  );
}

export function nationalLengthBounds(country: PhoneCountry): { min: number; max: number } {
  if (typeof country.nationalLength === 'number') {
    return { min: country.nationalLength, max: country.nationalLength };
  }
  return { min: country.nationalLength[0], max: country.nationalLength[1] };
}

export function maxNationalDigits(country: PhoneCountry): number {
  return nationalLengthBounds(country).max;
}

function formatGroupedPlaceholder(digits: string): string {
  if (digits.length === 10) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8)}`;
  }
  if (digits.length === 11) {
    return `${digits.slice(0, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 9) {
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`;
  }
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}

/** Плейсхолдер национальной части номера для поля ввода. */
export function phoneNationalPlaceholder(country: PhoneCountry): string {
  const { max } = nationalLengthBounds(country);
  const digitsOnly = country.example.replace(/\D/g, '');

  if (
    digitsOnly.length >= max - 1 &&
    digitsOnly.length <= max + 1 &&
    !/digit/i.test(country.example)
  ) {
    return formatGroupedPlaceholder(digitsOnly.replace(/\d/g, '0'));
  }

  const template =
    country.id === 'RU' || country.id === 'KZ'
      ? `9${'0'.repeat(Math.max(max - 1, 0))}`
      : '0'.repeat(max);

  return formatGroupedPlaceholder(template);
}

/** Поиск стран по названию, коду ISO или телефонному коду. */
export function searchPhoneCountries(query: string): PhoneCountry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [...PHONE_COUNTRIES];
  return PHONE_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.dialCode.includes(q.replace(/\s/g, '')),
  );
}
