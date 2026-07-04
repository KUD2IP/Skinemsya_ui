import { useCallback, useState } from 'react';
import { haptics } from './haptics';

const DEFAULT_MIN_MS = 400;

/**
 * Оборачивает refetch: гарантирует минимальную длительность анимации кнопки ↻,
 * чтобы быстрый ответ кэша не выглядел как «ничего не произошло».
 */
export function useRefreshAnimation(
  refetch: () => Promise<unknown>,
  isFetching: boolean,
  minMs = DEFAULT_MIN_MS,
) {
  const [holding, setHolding] = useState(false);

  const refresh = useCallback(async () => {
    if (holding || isFetching) return;
    haptics.tap();
    setHolding(true);
    const started = Date.now();
    try {
      await refetch();
    } catch {
      haptics.error();
    } finally {
      const remaining = minMs - (Date.now() - started);
      if (remaining > 0) {
        await new Promise((resolve) => setTimeout(resolve, remaining));
      }
      setHolding(false);
    }
  }, [refetch, isFetching, holding, minMs]);

  return {
    refresh,
    refreshing: isFetching || holding,
  };
}
