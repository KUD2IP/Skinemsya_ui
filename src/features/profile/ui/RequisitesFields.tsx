import { useEffect, useRef } from 'react';
import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import { PREFERRED_BANKS } from '../model/banks';
import type { ProfileFormValues } from '../model/schema';
import { scrollElementIntoContainer } from '@/shared/lib';
import {
  FieldGroup,
  Input,
  PhoneInput,
  SelectField,
  Stack,
} from '@/shared/ui';

export type RequisitesFocusField = 'bank' | 'phone';

interface RequisitesFieldsProps {
  control: Control<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
  preferredBankPreset: string | undefined;
  focusField?: RequisitesFocusField;
  onlyField?: RequisitesFocusField;
}

export function RequisitesFields({
  control,
  errors,
  preferredBankPreset,
  focusField,
  onlyField,
}: RequisitesFieldsProps) {
  const bankRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const showBank = !onlyField || onlyField === 'bank';
  const showPhone = !onlyField || onlyField === 'phone';

  useEffect(() => {
    if (!focusField) return;
    const timer = window.setTimeout(() => {
      const target = focusField === 'bank' ? bankRef.current : phoneRef.current;
      if (!target) return;

      const sheetBody = target.closest('[data-sheet-body]');
      if (sheetBody instanceof HTMLElement) {
        scrollElementIntoContainer(target, sheetBody);
        return;
      }

      target.scrollIntoView({ block: 'nearest', behavior: 'auto' });
    }, 280);
    return () => window.clearTimeout(timer);
  }, [focusField]);

  return (
    <Stack gap={6}>
      {showBank ? (
        <div ref={bankRef}>
        <FieldGroup
          label="Предпочитаемый банк"
          hint="Участники увидят его рядом с реквизитами при переводе."
          error={errors.preferredBankPreset?.message ?? errors.preferredBankCustom?.message}
        >
          <Stack gap={3}>
            <Controller
              control={control}
              name="preferredBankPreset"
              render={({ field }) => (
                <SelectField
                  items={PREFERRED_BANKS.map((bank) => ({
                    value: bank.id,
                    label: bank.label,
                  }))}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  placeholder="Выберите банк"
                  pickerTitle="Предпочитаемый банк"
                  ariaLabel="Предпочитаемый банк"
                />
              )}
            />
            {preferredBankPreset === 'other' ? (
              <Controller
                control={control}
                name="preferredBankCustom"
                render={({ field }) => (
                  <Input
                    placeholder="Например, Модульбанк"
                    invalid={Boolean(errors.preferredBankCustom)}
                    value={field.value ?? ''}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                )}
              />
            ) : null}
          </Stack>
        </FieldGroup>
        </div>
      ) : null}

      {showPhone ? (
        <div ref={phoneRef}>
        <FieldGroup
          label="Телефон для СБП"
          hint="Выберите код страны и введите номер без кода."
          error={errors.phoneNational?.message}
        >
          <Controller
            control={control}
            name="phoneCountryId"
            render={({ field: countryField }) => (
              <Controller
                control={control}
                name="phoneNational"
                render={({ field: nationalField }) => (
                  <PhoneInput
                    countryId={countryField.value}
                    national={nationalField.value ?? ''}
                    onCountryChange={countryField.onChange}
                    onNationalChange={nationalField.onChange}
                    invalid={Boolean(errors.phoneNational)}
                  />
                )}
              />
            )}
          />
        </FieldGroup>
        </div>
      ) : null}
    </Stack>
  );
}
