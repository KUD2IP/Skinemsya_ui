import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, toApiError } from '@/shared/api';
import type {
  ConfirmDebtorRequest,
  PaymentDetailsResponse,
  PaymentResponse,
} from '@/shared/api';
import { debtKeys } from '@/features/debts/api/queries';
import { eventKeys } from '@/features/events/api/queries';

export const paymentKeys = {
  all: ['payments'] as const,
  details: (debtId: number) => [...paymentKeys.all, 'details', debtId] as const,
};

export function usePaymentDetailsQuery(debtId: number) {
  return useQuery({
    queryKey: paymentKeys.details(debtId),
    queryFn: async () => {
      try {
        return await api.get(`debts/${debtId}/payment-details`).json<PaymentDetailsResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    enabled: debtId > 0,
  });
}

export function useConfirmDebtor(debtId: number, eventId: number, groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: ConfirmDebtorRequest) => {
      try {
        return await api
          .post(`debts/${debtId}/payment/confirm-debtor`, { json: body })
          .json<PaymentResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: paymentKeys.details(debtId) });
      void queryClient.invalidateQueries({ queryKey: debtKeys.byEvent(eventId) });
      void queryClient.invalidateQueries({ queryKey: debtKeys.participants(eventId) });
      void queryClient.invalidateQueries({ queryKey: debtKeys.summary() });
      void queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      void queryClient.invalidateQueries({ queryKey: eventKeys.byGroup(groupId) });
    },
  });
}

export function useConfirmAll(eventId: number, groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        return await api.post(`events/${eventId}/payments/confirm-all`).json<PaymentResponse[]>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: debtKeys.byEvent(eventId) });
      void queryClient.invalidateQueries({ queryKey: debtKeys.participants(eventId) });
      void queryClient.invalidateQueries({ queryKey: debtKeys.summary() });
      void queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      void queryClient.invalidateQueries({ queryKey: eventKeys.byGroup(groupId) });
    },
  });
}

export function useConfirmPayer(eventId: number, groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (debtId: number) => {
      try {
        return await api.post(`debts/${debtId}/payment/confirm-payer`).json<PaymentResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: debtKeys.byEvent(eventId) });
      void queryClient.invalidateQueries({ queryKey: debtKeys.participants(eventId) });
      void queryClient.invalidateQueries({ queryKey: debtKeys.summary() });
      void queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      void queryClient.invalidateQueries({ queryKey: eventKeys.byGroup(groupId) });
    },
  });
}

export function useDispute(eventId: number, groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (debtId: number) => {
      try {
        return await api.post(`debts/${debtId}/payment/dispute`).json<PaymentResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: debtKeys.byEvent(eventId) });
      void queryClient.invalidateQueries({ queryKey: debtKeys.participants(eventId) });
      void queryClient.invalidateQueries({ queryKey: debtKeys.summary() });
      void queryClient.invalidateQueries({ queryKey: eventKeys.detail(eventId) });
      void queryClient.invalidateQueries({ queryKey: eventKeys.byGroup(groupId) });
    },
  });
}
