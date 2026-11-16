import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isApiError, type EventResponse } from '@/shared/api';
import { haptics } from '@/shared/lib';
import {
  Button,
  FieldGroup,
  Input,
  Sheet,
  Stack,
  toast,
} from '@/shared/ui';
import { useCreateOneOffEvent } from '../api/queries';
import { CountField } from './CountField';
import {
  eventFormSchema,
  toCreateOneOffEventPayload,
  type EventFormValues,
} from '../model/schema';

interface CreateOneOffEventSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (event: EventResponse) => void;
}

export function CreateOneOffEventSheet({
  open,
  onOpenChange,
  onCreated,
}: CreateOneOffEventSheetProps) {
  const create = useCreateOneOffEvent();
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { name: '', expectedParticipantCount: 2 },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const event = await create.mutateAsync(toCreateOneOffEventPayload(values));
      haptics.success();
      toast.saved('Сбор создан');
      reset();
      onOpenChange(false);
      onCreated(event);
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось создать сбор');
    }
  });

  const handleClosed = () => {
    reset({ name: '', expectedParticipantCount: 2 });
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      onClosed={handleClosed}
      title="Новый сбор"
      description="Участники присоединятся по защищённой ссылке — группу создавать не нужно."
    >
      <form onSubmit={onSubmit}>
        <Stack gap={6}>
          <FieldGroup label="Название" error={errors.name?.message}>
            <Input
              placeholder="Ужин, такси, продукты…"
              invalid={Boolean(errors.name)}
              {...register('name')}
            />
          </FieldGroup>
          <FieldGroup
            label="Сколько человек"
            hint="Общие позиции делятся на это число"
            error={errors.expectedParticipantCount?.message}
          >
            <Controller
              name="expectedParticipantCount"
              control={control}
              render={({ field }) => (
                <CountField
                  value={field.value ?? 2}
                  invalid={Boolean(errors.expectedParticipantCount)}
                  onChange={(next) => field.onChange(next === '' ? 2 : next)}
                />
              )}
            />
          </FieldGroup>
          <Button type="submit" fullWidth loading={isSubmitting || create.isPending}>
            Создать сбор
          </Button>
        </Stack>
      </form>
    </Sheet>
  );
}
