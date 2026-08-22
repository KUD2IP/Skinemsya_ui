import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateEvent } from '../api/queries';
import {
  eventFormSchema,
  toUpdateEventPayload,
  type EventFormValues,
} from '../model/schema';
import type { EventResponse } from '@/shared/api';
import { isApiError } from '@/shared/api';
import { haptics } from '@/shared/lib';
import { Button, FieldGroup, Input, Sheet, Stack, Textarea, toast } from '@/shared/ui';
import { CountField } from './CountField';

interface EditEventSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: EventResponse;
}

export function EditEventSheet({ open, onOpenChange, event }: EditEventSheetProps) {
  const update = useUpdateEvent(event.id, event.groupId);
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event.name,
      description: event.description ?? '',
      expectedParticipantCount: event.expectedParticipantCount,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: event.name,
        description: event.description ?? '',
        expectedParticipantCount: event.expectedParticipantCount,
      });
    }
  }, [open, event, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await update.mutateAsync(toUpdateEventPayload(values, event.payerId));
      haptics.success();
      toast.success('Сбор обновлён');
      onOpenChange(false);
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось сохранить');
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Редактировать сбор">
      <form onSubmit={onSubmit}>
        <Stack gap={6}>
          <FieldGroup label="Название" error={errors.name?.message}>
            <Input invalid={Boolean(errors.name)} {...register('name')} />
          </FieldGroup>
          <FieldGroup label="Описание" error={errors.description?.message}>
            <Textarea invalid={Boolean(errors.description)} {...register('description')} />
          </FieldGroup>
          <FieldGroup
            label="Сколько человек"
            hint="Можно поменять, если ещё никто не начал переводить"
            error={errors.expectedParticipantCount?.message}
          >
            <Controller
              name="expectedParticipantCount"
              control={control}
              render={({ field }) => (
                <CountField
                  value={field.value ?? ''}
                  min={2}
                  max={99}
                  invalid={Boolean(errors.expectedParticipantCount)}
                  onChange={field.onChange}
                />
              )}
            />
          </FieldGroup>
          <Button type="submit" fullWidth loading={isSubmitting || update.isPending}>
            Сохранить
          </Button>
        </Stack>
      </form>
    </Sheet>
  );
}
