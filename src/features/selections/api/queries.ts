import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, toApiError } from '@/shared/api';
import type { UpdateSelectionsRequest } from '@/shared/api';
import { debtKeys } from '@/features/debts/api/queries';
import { eventKeys } from '@/features/events/api/queries';

export function useUpdateSelections(eventId: number) {
  return useMutation({
    mutationFn: async (body: UpdateSelectionsRequest) => {
      try {
        await api.put(`events/${eventId}/selections`, { json: body });
      } catch (error) {
        throw await toApiError(error);
      }
    },
  });
}

export function useCompleteSelection(eventId: number, groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post(`events/${eventId}/complete-selection`);
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      void queryClient.invalidateQueries({ queryKey: eventKeys.byGroup(groupId) });
      void queryClient.invalidateQueries({ queryKey: debtKeys.byEvent(eventId) });
      void queryClient.invalidateQueries({ queryKey: debtKeys.participants(eventId) });
    },
  });
}
