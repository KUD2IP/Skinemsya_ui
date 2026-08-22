import { z } from 'zod';

export const eventFormSchema = z.object({
  name: z.string().trim().min(1, 'Введите название').max(255, 'Не более 255 символов'),
  description: z.string().max(5000, 'Не более 5000 символов').optional().or(z.literal('')),
  expectedParticipantCount: z.coerce
    .number({ invalid_type_error: 'Укажите, сколько человек было' })
    .int('Укажите целое число')
    .min(2, 'Минимум 2 человека')
    .max(99, 'Не больше 99'),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export function toCreateEventPayload(values: EventFormValues, payerId: number) {
  const description = values.description?.trim();
  return {
    name: values.name.trim(),
    description: description || undefined,
    payerId,
    expectedParticipantCount: values.expectedParticipantCount,
  };
}

export function toUpdateEventPayload(values: EventFormValues, payerId: number) {
  return toCreateEventPayload(values, payerId);
}
