import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().trim().min(1, 'Введите название').max(255, 'Не более 255 символов'),
});

export const updateGroupSchema = createGroupSchema;

export const addMemberSchema = z.object({
  telegramUsername: z
    .string()
    .trim()
    .min(1, 'Введите @username')
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/i, 'Формат: @username (5–32 символа)'),
});

export type CreateGroupFormValues = z.infer<typeof createGroupSchema>;
export type UpdateGroupFormValues = z.infer<typeof updateGroupSchema>;
export type AddMemberFormValues = z.infer<typeof addMemberSchema>;
