import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getInitDataRaw } from '@/features/auth/lib/initData';
import {
  useCreateChatLinkedGroup,
  useCreateStandaloneGroup,
} from '../api/queries';
import { createGroupSchema, type CreateGroupFormValues } from '../model/schema';
import { isApiError } from '@/shared/api';
import { haptics } from '@/shared/lib';
import { Button, FieldGroup, Input, Sheet, Stack, toast } from '@/shared/ui';

interface CreateGroupSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (groupId: number) => void;
}

export function CreateGroupSheet({ open, onOpenChange, onCreated }: CreateGroupSheetProps) {
  const createStandalone = useCreateStandaloneGroup();
  const createChatLinked = useCreateChatLinkedGroup();
  const hasInitData = Boolean(getInitDataRaw());

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setFocus('name'), 280);
    return () => window.clearTimeout(timer);
  }, [open, setFocus]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      const group = await createStandalone.mutateAsync({ name: values.name.trim() });
      haptics.success();
      toast.saved('Группа создана');
      reset();
      onOpenChange(false);
      onCreated?.(group.id);
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось создать группу');
    }
  });

  const handleChatLinked = async () => {
    const initData = getInitDataRaw();
    if (!initData) {
      toast.error('Откройте приложение из чата Telegram');
      return;
    }
    try {
      const group = await createChatLinked.mutateAsync({ initData });
      haptics.success();
      toast.saved('Группа привязана к чату');
      onOpenChange(false);
      onCreated?.(group.id);
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось привязать чат');
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      onClosed={reset}
      title="Новая группа"
      description="Создайте группу для совместных расчётов."
    >
      <form onSubmit={onSubmit}>
        <Stack gap={6}>
          <FieldGroup label="Название" error={errors.name?.message}>
            <Input
              placeholder="Поездка, квартира, друзья…"
              invalid={Boolean(errors.name)}
              {...register('name')}
            />
          </FieldGroup>

          <Button type="submit" fullWidth loading={isSubmitting || createStandalone.isPending}>
            Создать
          </Button>

          {hasInitData ? (
            <Button
              type="button"
              variant="secondary"
              fullWidth
              loading={createChatLinked.isPending}
              onClick={() => void handleChatLinked()}
            >
              Из текущего чата Telegram
            </Button>
          ) : null}
        </Stack>
      </form>
    </Sheet>
  );
}
