import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreatePosition } from '../api/queries';
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

interface AddPositionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: number;
}

export function AddPositionSheet({ open, onOpenChange, eventId }: AddPositionSheetProps) {
  const create = useCreatePosition(eventId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', quantity: '1', priceRubles: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await create.mutateAsync({
        name: values.name.trim(),
        quantity: Number.parseInt(values.quantity, 10),
        totalPriceKopecks: rublesToKopecks(values.priceRubles),
      });
      haptics.success();
      toast.saved('Позиция добавлена');
      reset();
      onOpenChange(false);
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось добавить позицию');
    }
  });

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      onClosed={() => reset()}
      title="Добавить вручную"
    >
      <form onSubmit={onSubmit}>
        <Stack gap={6}>
          <FieldGroup label="Название" error={errors.name?.message}>
            <Input placeholder="Блюдо или позиция" invalid={Boolean(errors.name)} {...register('name')} />
          </FieldGroup>
          <FieldGroup label="Количество" error={errors.quantity?.message}>
            <Input
              type="number"
              inputMode="numeric"
              step="1"
              min="1"
              invalid={Boolean(errors.quantity)}
              {...register('quantity')}
            />
          </FieldGroup>
          <FieldGroup label="Общая цена, ₽" error={errors.priceRubles?.message}>
            <Input
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              hideSpinners
              invalid={Boolean(errors.priceRubles)}
              {...register('priceRubles')}
            />
          </FieldGroup>
          <Button type="submit" fullWidth loading={isSubmitting || create.isPending}>
            Добавить
          </Button>
        </Stack>
      </form>
    </Sheet>
  );
}
