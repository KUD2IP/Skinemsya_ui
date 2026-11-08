import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, toApiError } from '@/shared/api';
import type {
  SubscriptionCheckoutRequest,
  SubscriptionCheckoutResponse,
  SubscriptionResponse,
} from '@/shared/api';

export const subscriptionKeys = {
  me: ['subscription', 'me'] as const,
};

export function useSubscriptionQuery() {
  return useQuery({
    queryKey: subscriptionKeys.me,
    queryFn: async () => {
      try {
        return await api.get('me/subscription').json<SubscriptionResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    staleTime: 15_000,
  });
}

export function useSubscriptionCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: SubscriptionCheckoutRequest) => {
      try {
        return await api
          .post('me/subscription/checkout', { json: body })
          .json<SubscriptionCheckoutResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.me });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        await api.post('me/subscription/cancel');
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: subscriptionKeys.me });
    },
  });
}
