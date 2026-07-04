import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGroupMembersQuery } from '@/features/groups/api/queries';
import { useProfileQuery } from '@/features/profile/api/queries';
import { useCreateEvent } from '../api/queries';
import {
  eventFormSchema,
  toCreateEventPayload,
  type EventFormValues,
} from '../model/schema';
import { isApiError } from '@/shared/api';
import { haptics, memberDisplayLabel } from '@/shared/lib';
import {
  Button,
  EmptyState,
  FieldGroup,
  Input,
  SelectField,
  Sheet,
  Skeleton,
  Stack,
  Textarea,
  toast,
} from '@/shared/ui';

interface CreateEventSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
  onCreated?: (eventId: number) => void;
}

export function CreateEventSheet({
  open,
  onOpenChange,
  groupId,
  onCreated,
}: CreateEventSheetProps) {
  const create = useCreateEvent(groupId);
  const { data: user } = useProfileQuery();
  const {
    data: members,
    isLoading: membersLoading,
    isError: membersError,
    refetch: refetchMembers,
  } = useGroupMembersQuery(groupId);
  const [payerId, setPayerId] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { name: '', description: '' },
  });

  const payerOptions = useMemo(
    () =>
      (members ?? []).map((member) => ({
        value: member.userId,
        label: memberDisplayLabel(member.displayName, member.telegramUsername),
        hint: member.role === 'OWNER' ? 'Владелец' : undefined,
      })),
    [members],
  );

  useEffect(() => {
    if (!open || !members?.length) return;
    setPayerId((current) => {
      if (members.some((member) => member.userId === current)) return current;
      if (user && members.some((member) => member.userId === user.id)) return user.id;
      return members[0].userId;
    });
  }, [open, members, user]);

  const onSubmit = handleSubmit(async (values) => {
    if (!payerId) {
      toast.error('Выберите плательщика');
      return;
    }
    try {
      const event = await create.mutateAsync(toCreateEventPayload(values, payerId));
      haptics.success();
      toast.saved('Сбор создан');
      reset();
      onOpenChange(false);
      onCreated?.(event.id);
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось создать сбор');
    }
  });

  const handleClosed = () => {
    reset();
    setPayerId(0);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} onClosed={handleClosed} title="Новый сбор">
      <form onSubmit={onSubmit}>
        <Stack gap={6}>
          <FieldGroup label="Название" error={errors.name?.message}>
            <Input
              placeholder="Ужин, такси, продукты…"
              invalid={Boolean(errors.name)}
              {...register('name')}
            />
          </FieldGroup>
          <FieldGroup label="Описание" hint="Необязательно" error={errors.description?.message}>
            <Textarea placeholder="Детали сбора" invalid={Boolean(errors.description)} {...register('description')} />
          </FieldGroup>
          <FieldGroup label="Плательщик">
            {membersLoading ? (
              <Skeleton height={44} radius="md" />
            ) : membersError ? (
              <EmptyState
                title="Не удалось загрузить участников"
                description="Без списка участников нельзя выбрать плательщика."
                actions={
                  <Button type="button" variant="secondary" size="sm" onClick={() => void refetchMembers()}>
                    Повторить
                  </Button>
                }
              />
            ) : payerOptions.length ? (
              <SelectField
                ariaLabel="Плательщик"
                items={payerOptions}
                value={payerId || null}
                onChange={setPayerId}
                pickerTitle="Плательщик"
                searchPlaceholder="Поиск участника…"
                placeholder="Выберите плательщика"
              />
            ) : (
              <span>Добавьте участников в группу, чтобы выбрать плательщика.</span>
            )}
          </FieldGroup>
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting || create.isPending}
            disabled={!payerId || membersLoading || membersError}
          >
            Создать
          </Button>
        </Stack>
      </form>
    </Sheet>
  );
}
