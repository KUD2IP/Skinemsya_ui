import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, toApiError } from '@/shared/api';
import type { UpdateProfileRequest, UserResponse } from '@/shared/api';

export const profileKeys = {
  me: ['profile', 'me'] as const,
};

export function useProfileQuery() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: async () => {
      try {
        return await api.get('users/me').json<UserResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    staleTime: 60_000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: UpdateProfileRequest) => {
      try {
        return await api.put('users/me/profile', { json: body }).json<UserResponse>();
      } catch (error) {
        throw await toApiError(error);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(profileKeys.me, data);
    },
  });
}
