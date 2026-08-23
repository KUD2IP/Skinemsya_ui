import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

type TelegramWebApp = {
  onEvent?: (event: string, handler: () => void) => void;
  offEvent?: (event: string, handler: () => void) => void;
};

function telegramWebApp(): TelegramWebApp | undefined {
  return (window as Window & { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;
}

/** Сбрасывает активные запросы при возврате в Mini App / на вкладку. */
export function QueryVisibilitySync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const invalidateActive = () => {
      void queryClient.invalidateQueries({ refetchType: 'active' });
    };

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        invalidateActive();
      }
    };

    document.addEventListener('visibilitychange', onVisible);

    const webApp = telegramWebApp();
    webApp?.onEvent?.('activated', invalidateActive);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      webApp?.offEvent?.('activated', invalidateActive);
    };
  }, [queryClient]);

  return null;
}
