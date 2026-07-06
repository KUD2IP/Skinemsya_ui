import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, toApiError } from '@/shared/api';
import type {
  ConfirmDebtorRequest,
  DebtResponse,
  PaymentDetailsResponse,
  PaymentResponse,
} from '@/shared/api';
import { debtKeys } from '@/features/debts/api/queries';
import { eventKeys } from '@/features/events/api/queries';

function patchDebtInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  eventId: number,
  debtId: number,
  patch: Partial<DebtResponse>,
) {
  queryClient.setQueryData<DebtResponse[]>(debtKeys.byEvent(eventId), (old) =>
    old?.map((debt) => (debt.id === debtId ? { ...debt, ...patch } : debt)),
  );
}

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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: paymentKeys.details(debtId) });
      const previous = queryClient.getQueryData<PaymentDetailsResponse>(paymentKeys.details(debtId));
      if (previous) {
        queryClient.setQueryData<PaymentDetailsResponse>(paymentKeys.details(debtId), {
          ...previous,
          status: 'DEBTOR_CONFIRMED',
        });
      }
      return { previous };
    },
    onError: (_error, _body, context) => {
      if (context?.previous) {
        queryClient.setQueryData(paymentKeys.details(debtId), context.previous);
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
    onMutate: async (debtId) => {
      await queryClient.cancelQueries({ queryKey: debtKeys.byEvent(eventId) });
      const previous = queryClient.getQueryData<DebtResponse[]>(debtKeys.byEvent(eventId));
      patchDebtInCache(queryClient, eventId, debtId, {
        status: 'PAID',
        paymentStatus: 'PAYER_CONFIRMED',
      });
      return { previous };
    },
    onError: (_error, _debtId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(debtKeys.byEvent(eventId), context.previous);
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
    onMutate: async (debtId) => {
      await queryClient.cancelQueries({ queryKey: debtKeys.byEvent(eventId) });
      const previous = queryClient.getQueryData<DebtResponse[]>(debtKeys.byEvent(eventId));
      patchDebtInCache(queryClient, eventId, debtId, { paymentStatus: 'DISPUTED' });
      return { previous };
    },
    onError: (_error, _debtId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(debtKeys.byEvent(eventId), context.previous);
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
