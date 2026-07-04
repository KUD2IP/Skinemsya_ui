import { useCallback, useEffect, useRef, useState } from 'react';

export type TimedStatus = 'idle' | 'loading' | 'success' | 'error';

export function useTimedStatus(autoHideMs = 2000) {
  const [status, setStatus] = useState<TimedStatus>('idle');
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = undefined;
    }
  }, []);

  const show = useCallback(
    (next: TimedStatus) => {
      clearHideTimer();
      setStatus(next);
      if (next === 'success' || next === 'error') {
        hideTimer.current = setTimeout(() => setStatus('idle'), autoHideMs);
      }
    },
    [autoHideMs, clearHideTimer],
  );

  useEffect(() => clearHideTimer, [clearHideTimer]);

  return {
    status,
    show,
    isLoading: status === 'loading',
  };
}
