import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, isApiError, toApiError } from '@/shared/api';
import type { AdminMeResponse, AdminUserResponse, AdminUsersPageResponse } from '@/shared/api';

export const adminKeys = {
  me: ['admin', 'me'] as const,
  users: ['admin', 'users'] as const,
};

export function useAdminMeQuery() {
  return useQuery({
    queryKey: adminKeys.me,
    queryFn: async () => {
      try {
        return await api.get('admin/me').json<AdminMeResponse>();
      } catch (error) {
        const apiError = await toApiError(error);
        if (isApiError(apiError) && apiError.status === 403) return { admin: false };
        throw apiError;
      }
    },
    retry: false,
    staleTime: 60_000,
  });
}

export function useAdminUsersQuery(query: string, page: number) {
  return useQuery({
    queryKey: [...adminKeys.users, query, page] as const,
    queryFn: async () => {
      try {
        const searchParams: Record<string, string | number> = { page, size: 20 };
        if (query) searchParams.q = query;
        return await api.get('admin/users', { searchParams }).json<AdminUsersPageResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    placeholderData: keepPreviousData,
  });
}

export function useRevokeSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      try {
        return await api.delete(`admin/users/${userId}/subscription`).json<AdminUserResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.users });
    },
  });
}

export function useGrantSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: number) => {
      try {
        return await api.post(`admin/users/${userId}/subscription`).json<AdminUserResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: adminKeys.users });
    },
  });
}
