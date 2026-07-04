import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { PositionResponse } from '@/shared/api';
import { useUpdatePosition } from '../api/queries';
import { isApiError } from '@/shared/api';
import { haptics, rublesToKopecks } from '@/shared/lib';
import { Button, FieldGroup, Input, Sheet, Stack, toast } from '@/shared/ui';

const schema = z.object({
  name: z.string().trim().min(1, 'Укажите название').max(255),
  quantity: z
    .string()
    .trim()
    .min(1, 'Укажите количество')
    .refine((v) => /^\d+$/.test(v) && Number(v) >= 1, 'Минимум 1'),
  priceRubles: z
    .string()
    .trim()
    .min(1, 'Укажите цену')
    .refine((v) => Number(v.replace(',', '.')) >= 0.01, 'Минимум 0.01'),
});

type FormValues = z.infer<typeof schema>;

interface EditPositionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: number;
  position: PositionResponse | null;
}

function toPriceRubles(kopecks: number): string {
  return String(kopecks / 100).replace('.', ',');
}

export function EditPositionSheet({
  open,
  onOpenChange,
  eventId,
  position,
}: EditPositionSheetProps) {
  const update = useUpdatePosition(eventId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', quantity: '1', priceRubles: '' },
  });

  useEffect(() => {
    if (open && position) {
      reset({
        name: position.name,
        quantity: String(position.quantity),
        priceRubles: toPriceRubles(position.totalPriceKopecks),
      });
    }
  }, [open, position, reset]);

  const onSubmit = handleSubmit(async (values) => {
    if (!position) return;
    try {
      await update.mutateAsync({
        id: position.id,
        body: {
          name: values.name.trim(),
          quantity: Number.parseInt(values.quantity, 10),
          totalPriceKopecks: rublesToKopecks(values.priceRubles),
        },
      });
      haptics.success();
      toast.success('Позиция обновлена');
      onOpenChange(false);
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось обновить позицию');
    }
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange} title="Изменить позицию">
      <form onSubmit={(e) => void onSubmit(e)}>
        <Stack gap={4}>
          <FieldGroup label="Название" error={errors.name?.message}>
            <Input {...register('name')} autoComplete="off" />
          </FieldGroup>
          <FieldGroup label="Количество" error={errors.quantity?.message}>
            <Input {...register('quantity')} inputMode="numeric" />
          </FieldGroup>
          <FieldGroup label="Сумма, ₽" error={errors.priceRubles?.message}>
            <Input {...register('priceRubles')} inputMode="decimal" />
          </FieldGroup>
          <Button type="submit" fullWidth loading={isSubmitting || update.isPending}>
            Сохранить
          </Button>
        </Stack>
      </form>
    </Sheet>
  );
}
