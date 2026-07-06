import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, toApiError } from '@/shared/api';
import type { CreateEventRequest, EventResponse, PageResult, UpdateEventRequest } from '@/shared/api';
import { pageHasMore } from '@/shared/api/dto';

const PAGE_SIZE = 20;

export const eventKeys = {
  all: ['events'] as const,
  byGroup: (groupId: number) => [...eventKeys.all, 'group', groupId] as const,
  detail: (eventId: number) => [...eventKeys.all, 'detail', eventId] as const,
};

async function fetchEventsPage(groupId: number, page: number): Promise<PageResult<EventResponse>> {
  try {
    return await api
      .get(`groups/${groupId}/events`, { searchParams: { page, size: PAGE_SIZE } })
      .json<PageResult<EventResponse>>();
  } catch (error) {
    throw await toApiError(error);
  }
}

export function useGroupEventsInfiniteQuery(groupId: number) {
  return useInfiniteQuery({
    queryKey: eventKeys.byGroup(groupId),
    queryFn: ({ pageParam }) => fetchEventsPage(groupId, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (pageHasMore(lastPage) ? lastPage.page + 1 : undefined),
    enabled: groupId > 0,
  });
}

export function useGroupEventsQuery(groupId: number) {
  return useQuery({
    queryKey: [...eventKeys.byGroup(groupId), 'legacy'],
    queryFn: async () => {
      const page = await fetchEventsPage(groupId, 0);
      return page.items;
    },
    enabled: groupId > 0,
  });
}

export function useEventQuery(eventId: number) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: async () => {
      try {
        return await api.get(`events/${eventId}`).json<EventResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    enabled: eventId > 0,
  });
}

export function useCreateEvent(groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateEventRequest) => {
      try {
        return await api.post(`groups/${groupId}/events`, { json: body }).json<EventResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventKeys.byGroup(groupId) });
    },
  });
}

export function useUpdateEvent(eventId: number, groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateEventRequest) => {
      try {
        return await api.put(`events/${eventId}`, { json: body }).json<EventResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(eventKeys.detail(eventId), data);
      void queryClient.invalidateQueries({ queryKey: eventKeys.byGroup(groupId) });
    },
  });
}

export function useDeleteEvent(groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (eventId: number) => {
      try {
        await api.delete(`events/${eventId}`);
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: eventKeys.byGroup(groupId) });
    },
  });
}

export function useSendToDistribution(eventId: number, groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        return await api.post(`events/${eventId}/send-to-distribution`).json<EventResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(eventKeys.detail(eventId), data);
      void queryClient.invalidateQueries({ queryKey: eventKeys.byGroup(groupId) });
    },
  });
}

export function useCloseEvent(eventId: number, groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      try {
        return await api.post(`events/${eventId}/close`).json<EventResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(eventKeys.detail(eventId), data);
      void queryClient.invalidateQueries({ queryKey: eventKeys.byGroup(groupId) });
    },
  });
}

export function flattenPageItems<T>(pages: PageResult<T>[] | undefined): T[] {
  return pages?.flatMap((page) => page.items) ?? [];
}
