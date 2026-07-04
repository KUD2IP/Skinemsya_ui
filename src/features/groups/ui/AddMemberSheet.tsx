import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAddGroupMember } from '../api/queries';
import { addMemberSchema, type AddMemberFormValues } from '../model/schema';
import { isApiError } from '@/shared/api';
import { haptics } from '@/shared/lib';
import { Button, FieldGroup, Input, Sheet, Stack, toast } from '@/shared/ui';

interface AddMemberSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: number;
}

function addMemberErrorMessage(error: unknown): string {
  if (!isApiError(error)) return 'Не удалось добавить участника';
  if (error.code === 'NOT_FOUND') {
    return 'Пользователь не найден. Попросите его хотя бы раз открыть Mini App.';
  }
  if (error.code === 'DOMAIN_RULE_VIOLATION') {
    return 'Добавление по @username доступно только в своих группах, не в чатах Telegram.';
  }
  return error.message;
}

export function AddMemberSheet({ open, onOpenChange, groupId }: AddMemberSheetProps) {
  const addMember = useAddGroupMember(groupId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddMemberFormValues>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { telegramUsername: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await addMember.mutateAsync({ telegramUsername: values.telegramUsername });
      haptics.success();
      toast.saved('Участник добавлен');
      reset();
      onOpenChange(false);
    } catch (error) {
      haptics.error();
      toast.error(addMemberErrorMessage(error));
    }
  });

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      onClosed={reset}
      title="Добавить участника"
      description="Укажите @username в Telegram. Человек должен хотя бы раз открыть приложение."
    >
      <form onSubmit={onSubmit}>
        <Stack gap={6}>
          <FieldGroup
            label="Telegram @username"
            hint="Например: @ivan"
            error={errors.telegramUsername?.message}
          >
            <Input
              placeholder="@username"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              invalid={Boolean(errors.telegramUsername)}
              {...register('telegramUsername')}
            />
          </FieldGroup>
          <Button type="submit" fullWidth loading={isSubmitting || addMember.isPending}>
            Добавить
          </Button>
        </Stack>
      </form>
    </Sheet>
  );
}
