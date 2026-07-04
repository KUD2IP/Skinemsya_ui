import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateGroup } from '../api/queries';
import { updateGroupSchema, type UpdateGroupFormValues } from '../model/schema';
import type { GroupResponse } from '@/shared/api';
import { isApiError } from '@/shared/api';
import { haptics } from '@/shared/lib';
import { Button, FieldGroup, Input, Sheet, Stack, toast } from '@/shared/ui';

interface EditGroupSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: GroupResponse;
}

export function EditGroupSheet({ open, onOpenChange, group }: EditGroupSheetProps) {
  const update = useUpdateGroup(group.id);
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UpdateGroupFormValues>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: { name: group.name },
  });

  useEffect(() => {
    if (open) reset({ name: group.name });
  }, [open, group.name, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await update.mutateAsync({ name: values.name.trim() });
      haptics.success();
      toast.success('Группа обновлена');
      onOpenChange(false);
    } catch (error) {
      haptics.error();
      if (isApiError(error)) {
        const fieldMessage = error.fields?.find((field) => field.field === 'name')?.message;
        if (fieldMessage) {
          setError('name', { message: fieldMessage });
          return;
        }
        toast.error(error.message);
        return;
      }
      toast.error('Не удалось сохранить');
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Переименовать группу">
      <form onSubmit={onSubmit}>
        <Stack gap={6}>
          <FieldGroup label="Название" error={errors.name?.message}>
            <Input invalid={Boolean(errors.name)} {...register('name')} />
          </FieldGroup>
          <Button type="submit" fullWidth loading={isSubmitting || update.isPending}>
            Сохранить
          </Button>
        </Stack>
      </form>
    </Sheet>
  );
}
