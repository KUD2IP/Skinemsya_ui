import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, toApiError } from '@/shared/api';
import type {
  CreatePositionRequest,
  MarkSharedRequest,
  PositionResponse,
  ProcessReceiptRequest,
  ReceiptResponse,
  UpdatePositionRequest,
} from '@/shared/api';

export const positionKeys = {
  all: ['positions'] as const,
  byEvent: (eventId: number) => [...positionKeys.all, 'event', eventId] as const,
};

export function usePositionsQuery(eventId: number, options?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: positionKeys.byEvent(eventId),
    queryFn: async () => {
      try {
        return await api.get(`events/${eventId}/positions`).json<PositionResponse[]>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    enabled: eventId > 0,
    refetchInterval: options?.refetchInterval,
  });
}

export function useCreatePosition(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreatePositionRequest) => {
      try {
        return await api
          .post(`events/${eventId}/positions`, { json: body })
          .json<PositionResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: positionKeys.byEvent(eventId) });
    },
  });
}

export function useUpdatePosition(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: UpdatePositionRequest }) => {
      try {
        return await api.put(`positions/${id}`, { json: body }).json<PositionResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: positionKeys.byEvent(eventId) });
    },
  });
}

export function useDeletePosition(eventId: number) {
  const queryClient = useQueryClient();
  const queryKey = positionKeys.byEvent(eventId);

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        await api.delete(`positions/${id}`);
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PositionResponse[]>(queryKey);
      queryClient.setQueryData<PositionResponse[]>(queryKey, (old) =>
        old?.filter((position) => position.id !== id),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useMarkShared(eventId: number) {
  const queryClient = useQueryClient();
  const queryKey = positionKeys.byEvent(eventId);

  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: MarkSharedRequest }) => {
      try {
        return await api
          .post(`positions/${id}/mark-shared`, { json: body })
          .json<PositionResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PositionResponse[]>(queryKey);
      queryClient.setQueryData<PositionResponse[]>(queryKey, (old) =>
        old?.map((position) =>
          position.id === id ? { ...position, shared: true } : position,
        ),
      );
      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}

export function useUnmarkShared(eventId: number) {
  const queryClient = useQueryClient();
  const queryKey = positionKeys.byEvent(eventId);

  return useMutation({
    mutationFn: async (id: number) => {
      try {
        return await api.post(`positions/${id}/unmark-shared`).json<PositionResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey });
      const previous = queryClient.getQueryData<PositionResponse[]>(queryKey);
      queryClient.setQueryData<PositionResponse[]>(queryKey, (old) =>
        old?.map((position) =>
          position.id === id ? { ...position, shared: false } : position,
        ),
      );
      return { previous };
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKey, context.previous);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
}

export const receiptKeys = {
  all: ['receipts'] as const,
  byEvent: (eventId: number) => [...receiptKeys.all, 'event', eventId] as const,
};

export function useEventReceiptsQuery(eventId: number) {
  return useQuery({
    queryKey: receiptKeys.byEvent(eventId),
    queryFn: async () => {
      try {
        return await api.get(`events/${eventId}/receipts`).json<ReceiptResponse[]>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    enabled: eventId > 0,
  });
}

export function useProcessReceipt(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: ProcessReceiptRequest) => {
      try {
        // Без клиентского abort: на VPS OCR часто дольше дефолтных 15–60 с.
        // Логика бека та же; меняется только ожидание ответа HTTP.
        return await api
          .post(`events/${eventId}/receipts`, { json: body, timeout: false })
          .json<ReceiptResponse>();
      } catch (error) {
        const apiError = await toApiError(error);
        // Если прокси/клиент оборвали долгий POST, бек часто всё равно дописывает чек.
        // Дожидаемся финального статуса по fileId — позиции появятся без reload Mini App.
        if (apiError.status === 0 || apiError.status === 502 || apiError.status === 504) {
          const recovered = await waitForReceiptResult(eventId, body.fileId);
          if (recovered) return recovered;
        }
        throw apiError;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: positionKeys.byEvent(eventId) });
      void queryClient.invalidateQueries({ queryKey: receiptKeys.byEvent(eventId) });
    },
  });
}

async function waitForReceiptResult(
  eventId: number,
  fileId: number,
  maxWaitMs = 120_000,
): Promise<ReceiptResponse | null> {
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const receipts = await api
        .get(`events/${eventId}/receipts`, { timeout: 15_000 })
        .json<ReceiptResponse[]>();
      const match = receipts.find((receipt) => receipt.fileId === fileId);
      if (match?.status === 'PROCESSED' || match?.status === 'FAILED') {
        return match;
      }
    } catch {
      // краткий сбой сети при опросе — пробуем дальше
    }
  }
  return null;
}

export function useSplitTips(eventId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (receiptId: number) => {
      try {
        return await api
          .post(`events/${eventId}/receipts/${receiptId}/split-tips`)
          .json<ReceiptResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: positionKeys.byEvent(eventId) });
    },
  });
}
