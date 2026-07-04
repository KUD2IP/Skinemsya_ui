import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateProfile } from '../api/queries';
import {
  profileFormSchema,
  toUpdateProfilePayload,
  DEFAULT_PHONE_COUNTRY_ID,
  type ProfileFormValues,
} from '../model/schema';
import { PREFERRED_BANKS, preferredBankFormDefaults } from '../model/banks';
import type { UserResponse } from '@/shared/api';
import { isApiError } from '@/shared/api';
import { parseStoredPhone, haptics } from '@/shared/lib';
import {
  Button,
  CardInput,
  FieldGroup,
  Input,
  PhoneInput,
  SelectField,
  Sheet,
  Stack,
  toast,
} from '@/shared/ui';

interface EditProfileSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse;
}

function phoneDefaults(user: UserResponse): Pick<ProfileFormValues, 'phoneCountryId' | 'phoneNational'> {
  const parsed = parseStoredPhone(user.phone);
  return {
    phoneCountryId: parsed.countryId || DEFAULT_PHONE_COUNTRY_ID,
    phoneNational: parsed.national,
  };
}

function bankDefaults(user: UserResponse): Pick<
  ProfileFormValues,
  'preferredBankPreset' | 'preferredBankCustom'
> {
  return preferredBankFormDefaults(user.preferredBank);
}

export function EditProfileSheet({ open, onOpenChange, user }: EditProfileSheetProps) {
  const update = useUpdateProfile();
  const {
    control,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      paymentDetails: user.paymentDetails ?? '',
      ...bankDefaults(user),
      ...phoneDefaults(user),
    },
  });

  const preferredBankPreset = watch('preferredBankPreset');

  useEffect(() => {
    if (open) {
      reset({
        paymentDetails: user.paymentDetails ?? '',
        ...bankDefaults(user),
        ...phoneDefaults(user),
      });
    }
  }, [open, user, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await update.mutateAsync(toUpdateProfilePayload(values, user.notificationSettings));
      haptics.success();
      toast.saved('Профиль обновлён');
      onOpenChange(false);
    } catch (error) {
      haptics.error();
      if (isApiError(error)) {
        error.fields?.forEach((field) => {
          if (field.field === 'paymentDetails') {
            setError('paymentDetails', { message: field.message });
          }
          if (field.field === 'phone') {
            setError('phoneNational', { message: field.message });
          }
          if (field.field === 'preferredBank') {
            setError('preferredBankCustom', { message: field.message });
          }
        });
        toast.error(error.message);
      } else {
        toast.error('Не удалось сохранить');
      }
    }
  });

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title="Редактировать профиль"
      description="Реквизиты для расчётов видят участники ваших сборов."
    >
      <form onSubmit={onSubmit}>
        <Stack gap={6}>
          <FieldGroup
            label="Номер карты"
            hint="Проверяется длина и алгоритм Луна."
            error={errors.paymentDetails?.message}
          >
            <Controller
              control={control}
              name="paymentDetails"
              render={({ field }) => (
                <CardInput
                  placeholder="0000 0000 0000 0000"
                  invalid={Boolean(errors.paymentDetails)}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              )}
            />
          </FieldGroup>

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

          <Stack direction="row" gap={3}>
            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit" fullWidth loading={isSubmitting || update.isPending}>
              Сохранить
            </Button>
          </Stack>
        </Stack>
      </form>
    </Sheet>
  );
}
