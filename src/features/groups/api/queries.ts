import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, toApiError } from '@/shared/api';
import type {
  AddGroupMemberRequest,
  ChatLinkedGroupRequest,
  CreateStandaloneGroupRequest,
  GroupMemberViewResponse,
  GroupResponse,
  PageResult,
  UpdateGroupRequest,
} from '@/shared/api';
import { pageHasMore } from '@/shared/api/dto';
import { normalizeTelegramUsername } from '@/shared/lib';

const PAGE_SIZE = 20;
const MEMBERS_PICKER_SIZE = 100;

export const groupKeys = {
  all: ['groups'] as const,
  list: () => [...groupKeys.all, 'list'] as const,
  detail: (groupId: number) => [...groupKeys.all, 'detail', groupId] as const,
  members: (groupId: number) => [...groupKeys.all, 'members', groupId] as const,
};

async function fetchGroupsPage(page: number): Promise<PageResult<GroupResponse>> {
  try {
    return await api
      .get('groups', { searchParams: { page, size: PAGE_SIZE } })
      .json<PageResult<GroupResponse>>();
  } catch (error) {
    throw await toApiError(error);
  }
}

export function useGroupsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: groupKeys.list(),
    queryFn: ({ pageParam }) => fetchGroupsPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (pageHasMore(lastPage) ? lastPage.page + 1 : undefined),
  });
}

/** @deprecated use useGroupsInfiniteQuery — kept for gradual migration */
export function useGroupsQuery() {
  return useQuery({
    queryKey: [...groupKeys.list(), 'legacy'],
    queryFn: async () => {
      const page = await fetchGroupsPage(0);
      return page.items;
    },
  });
}

export function useGroupQuery(groupId: number) {
  return useQuery({
    queryKey: groupKeys.detail(groupId),
    queryFn: async () => {
      try {
        return await api.get(`groups/${groupId}`).json<GroupResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    enabled: groupId > 0,
  });
}

export function useCreateStandaloneGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateStandaloneGroupRequest) => {
      try {
        return await api.post('groups/standalone', { json: body }).json<GroupResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: groupKeys.list() });
    },
  });
}

export function useCreateChatLinkedGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: ChatLinkedGroupRequest) => {
      try {
        return await api.post('groups/chat-linked', { json: body }).json<GroupResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: groupKeys.list() });
    },
  });
}

export function useUpdateGroup(groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateGroupRequest) => {
      try {
        return await api.put(`groups/${groupId}`, { json: body }).json<GroupResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(groupKeys.detail(groupId), data);
      void queryClient.invalidateQueries({ queryKey: groupKeys.list() });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (groupId: number) => {
      try {
        await api.delete(`groups/${groupId}`);
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: groupKeys.all });
    },
  });
}

async function fetchMembersPage(
  groupId: number,
  page: number,
  size: number,
): Promise<PageResult<GroupMemberViewResponse>> {
  try {
    return await api
      .get(`groups/${groupId}/members`, { searchParams: { page, size } })
      .json<PageResult<GroupMemberViewResponse>>();
  } catch (error) {
    throw await toApiError(error);
  }
}

export function useGroupMembersInfiniteQuery(groupId: number) {
  return useInfiniteQuery({
    queryKey: groupKeys.members(groupId),
    queryFn: ({ pageParam }) => fetchMembersPage(groupId, pageParam, PAGE_SIZE),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (pageHasMore(lastPage) ? lastPage.page + 1 : undefined),
    enabled: groupId > 0,
  });
}

/** Загружает участников для picker (одна страница, до 100 человек). */
export function useGroupMembersQuery(groupId: number) {
  return useQuery({
    queryKey: [...groupKeys.members(groupId), 'picker'],
    queryFn: async () => {
      const page = await fetchMembersPage(groupId, 0, MEMBERS_PICKER_SIZE);
      return page.items;
    },
    enabled: groupId > 0,
  });
}

export function useAddGroupMember(groupId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: AddGroupMemberRequest) => {
      try {
        return await api
          .post(`groups/${groupId}/members`, {
            json: { telegramUsername: normalizeTelegramUsername(body.telegramUsername) },
          })
          .json<GroupMemberViewResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: groupKeys.members(groupId) });
    },
  });
}

export function flattenPageItems<T>(pages: PageResult<T>[] | undefined): T[] {
  return pages?.flatMap((page) => page.items) ?? [];
}
