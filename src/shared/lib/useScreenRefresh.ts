import { useCallback } from 'react';
import { type QueryKey, useQueryClient } from '@tanstack/react-query';
import { useRefreshAnimation } from './useRefreshAnimation';

/** Обновляет запросы экрана одной кнопкой ↻. Крутится только по нажатию, не от фонового refetch. */
export function useScreenRefresh(queryKeys: readonly QueryKey[]) {
  const queryClient = useQueryClient();
  const keyFingerprint = queryKeys.map((key) => key.join('\0')).join('|');

  const refetch = useCallback(async () => {
    await Promise.all(queryKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
    // keyFingerprint captures queryKeys identity for this callback.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, keyFingerprint]);

  return useRefreshAnimation(refetch, false);
}
