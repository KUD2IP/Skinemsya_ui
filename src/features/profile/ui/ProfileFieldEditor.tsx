import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateProfile } from '../api/queries';
import {
  profileFormSchema,
  toUpdateProfilePayload,
  DEFAULT_PHONE_COUNTRY_ID,
  type ProfileFormValues,
} from '../model/schema';
import { preferredBankFormDefaults } from '../model/banks';
import type { UserResponse } from '@/shared/api';
import { isApiError } from '@/shared/api';
import { parseStoredPhone, haptics } from '@/shared/lib';
import { Button, Stack, toast } from '@/shared/ui';
import { RequisitesFields, type RequisitesFocusField } from './RequisitesFields';
import * as css from './ProfileScreen.css';

interface ProfileFieldEditorProps {
  user: UserResponse;
  field: RequisitesFocusField;
  onCancel: () => void;
  onSaved: () => void;
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

export function ProfileFieldEditor({ user, field, onCancel, onSaved }: ProfileFieldEditorProps) {
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
      ...bankDefaults(user),
      ...phoneDefaults(user),
    },
  });

  const preferredBankPreset = watch('preferredBankPreset');

  useEffect(() => {
    reset({
      ...bankDefaults(user),
      ...phoneDefaults(user),
    });
  }, [user, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await update.mutateAsync(toUpdateProfilePayload(values, user.notificationSettings));
      haptics.success();
      toast.saved('Сохранено');
      onSaved();
    } catch (error) {
      haptics.error();
      if (isApiError(error)) {
        error.fields?.forEach((f) => {
          if (f.field === 'phone') {
            setError('phoneNational', { message: f.message });
          }
          if (f.field === 'preferredBank') {
            setError('preferredBankCustom', { message: f.message });
          }
        });
        toast.error(error.message);
      } else {
        toast.error('Не удалось сохранить');
      }
    }
  });

  return (
    <div className={css.inlineEditor}>
      <form onSubmit={onSubmit}>
        <Stack gap={4}>
          <RequisitesFields
            control={control}
            errors={errors}
            preferredBankPreset={preferredBankPreset}
            focusField={field}
            onlyField={field}
          />
          <Stack direction="row" gap={3}>
            <Button type="button" variant="secondary" fullWidth onClick={onCancel}>
              Отмена
            </Button>
            <Button type="submit" fullWidth loading={isSubmitting || update.isPending}>
              Сохранить
            </Button>
          </Stack>
        </Stack>
      </form>
    </div>
  );
}
