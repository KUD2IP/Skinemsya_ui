import { z } from 'zod';

export const eventFormSchema = z.object({
  name: z.string().trim().min(1, 'Введите название').max(255, 'Не более 255 символов'),
  expectedParticipantCount: z
    .number({ error: 'Укажите, сколько человек было' })
    .int('Укажите целое число')
    .min(2, 'Минимум 2 человека')
    .max(99, 'Не больше 99'),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export function toCreateEventPayload(values: EventFormValues, payerId: number) {
  return {
    name: values.name.trim(),
    payerId,
    expectedParticipantCount: values.expectedParticipantCount,
  };
}

export function toCreateOneOffEventPayload(values: EventFormValues) {
  return {
    name: values.name.trim(),
    expectedParticipantCount: values.expectedParticipantCount,
  };
}

export function toUpdateEventPayload(values: EventFormValues, payerId: number) {
  return toCreateEventPayload(values, payerId);
}
