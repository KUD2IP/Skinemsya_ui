/** Популярные банки для выбора в профиле. */
export const PREFERRED_BANKS = [
  { id: '', label: 'Не указан' },
  { id: 'sber', label: 'Сбербанк' },
  { id: 'tinkoff', label: 'Т-Банк' },
  { id: 'vtb', label: 'ВТБ' },
  { id: 'alfa', label: 'Альфа-Банк' },
  { id: 'raiffeisen', label: 'Райффайзенбанк' },
  { id: 'gazprom', label: 'Газпромбанк' },
  { id: 'ozon', label: 'Ozon Банк' },
  { id: 'yandex', label: 'Яндекс Банк' },
  { id: 'other', label: 'Другой — ввести вручную' },
] as const;

export type PreferredBankId = (typeof PREFERRED_BANKS)[number]['id'];

const KNOWN_BANK_IDS = new Set<string>(
  PREFERRED_BANKS.map((bank) => bank.id).filter((id) => id !== '' && id !== 'other'),
);

export function isKnownPreferredBankId(value: string | null | undefined): boolean {
  return Boolean(value && KNOWN_BANK_IDS.has(value));
}

/** Человекочитаемое название: id из списка или произвольный текст. */
export function preferredBankLabel(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const known = PREFERRED_BANKS.find((bank) => bank.id === value);
  if (known && known.id !== '' && known.id !== 'other') {
    return known.label;
  }
  return value.trim();
}

export function preferredBankFormDefaults(
  stored: string | null | undefined,
): { preferredBankPreset: string; preferredBankCustom: string } {
  const value = stored?.trim() ?? '';
  if (!value) {
    return { preferredBankPreset: '', preferredBankCustom: '' };
  }
  if (isKnownPreferredBankId(value)) {
    return { preferredBankPreset: value, preferredBankCustom: '' };
  }
  return { preferredBankPreset: 'other', preferredBankCustom: value };
}

export function resolvePreferredBankForSave(
  preset: string | undefined,
  custom: string | undefined,
): string | undefined {
  const selected = preset?.trim() ?? '';
  if (!selected) return undefined;
  if (selected === 'other') {
    return custom?.trim() || undefined;
  }
  return selected;
}
