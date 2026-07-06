import { z } from 'zod';
import {
  DEFAULT_PHONE_COUNTRY_ID,
  getPhoneCountry,
  isValidInternationalPhone,
  nationalLengthBounds,
  normalizeInternationalPhone,
} from '@/shared/lib';
import { resolvePreferredBankForSave } from './banks';

/** Валидация формы профиля. Лимиты соответствуют бэкенду (docs/API.md). */
export const profileFormSchema = z
  .object({
    preferredBankPreset: z.string().max(100).optional().or(z.literal('')),
    preferredBankCustom: z
      .string()
      .max(100, 'Не более 100 символов')
      .optional()
      .or(z.literal('')),
    phoneCountryId: z.string().min(1),
    phoneNational: z.string().optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const national = data.phoneNational?.trim() ?? '';
    if (!national) return;

    const country = getPhoneCountry(data.phoneCountryId);
    const { min, max } = nationalLengthBounds(country);

    if (!isValidInternationalPhone(data.phoneCountryId, national)) {
      ctx.addIssue({
        code: 'custom',
        path: ['phoneNational'],
        message:
          min === max
            ? `Введите ${min} цифр номера после ${country.dialCode}`
            : `Введите от ${min} до ${max} цифр номера после ${country.dialCode}`,
      });
    }

    if (data.preferredBankPreset === 'other' && !data.preferredBankCustom?.trim()) {
      ctx.addIssue({
        code: 'custom',
        path: ['preferredBankCustom'],
        message: 'Укажите название банка',
      });
    }
  });

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

/** Нормализует значения формы перед отправкой на API. */
export function toUpdateProfilePayload(
  values: ProfileFormValues,
  notificationSettings?: string | null,
) {
  const national = values.phoneNational?.trim() ?? '';
  const normalizedPhone = national
    ? normalizeInternationalPhone(values.phoneCountryId, national)
    : null;

  return {
    phone: normalizedPhone ?? undefined,
    preferredBank: resolvePreferredBankForSave(
      values.preferredBankPreset,
      values.preferredBankCustom,
    ),
    notificationSettings: notificationSettings ?? undefined,
  };
}

export { DEFAULT_PHONE_COUNTRY_ID };
