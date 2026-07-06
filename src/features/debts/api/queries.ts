import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, toApiError } from '@/shared/api';
import type {
  DebtResponse,
  DebtSummaryResponse,
  ParticipantsStatusResponse,
} from '@/shared/api';

export const debtKeys = {
  all: ['debts'] as const,
  summary: () => [...debtKeys.all, 'summary'] as const,
  byEvent: (eventId: number) => [...debtKeys.all, 'event', eventId] as const,
  participants: (eventId: number) => [...debtKeys.all, 'participants', eventId] as const,
};

export function useEventDebtsQuery(eventId: number) {
  return useQuery({
    queryKey: debtKeys.byEvent(eventId),
    queryFn: async () => {
      try {
        return await api.get(`events/${eventId}/debts`).json<DebtResponse[]>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    enabled: eventId > 0,
    refetchInterval: (query) => {
      const debts = query.state.data;
      if (!debts?.some((d) => d.status === 'PENDING_CONFIRMATION')) {
        return false;
      }
      return 3_000;
    },
    refetchIntervalInBackground: true,
  });
}

export function useDebtSummaryQuery() {
  return useQuery({
    queryKey: debtKeys.summary(),
    queryFn: async () => {
      try {
        return await api.get('debts/summary').json<DebtSummaryResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
  });
}

export function useParticipantsStatusQuery(eventId: number) {
  return useQuery({
    queryKey: debtKeys.participants(eventId),
    queryFn: async () => {
      try {
        return await api.get(`events/${eventId}/participants-status`).json<ParticipantsStatusResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    enabled: eventId > 0,
    refetchInterval: 15_000,
  });
}

export function useRemindMutation(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post(`events/${eventId}/remind`);
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: debtKeys.participants(eventId) });
    },
  });
}
