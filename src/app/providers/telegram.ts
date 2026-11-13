import {
  bindMiniAppCssVars,
  bindThemeParamsCssVars,
  bindViewportCssVars,
  expandViewport,
  init,
  isFullscreen,
  requestFullscreen,
  miniAppReady,
  mountBackButton,
  mountMiniAppSync,
  mountThemeParamsSync,
  mountViewport,
  setMiniAppBackgroundColor,
  setMiniAppHeaderColor,
} from '@telegram-apps/sdk-react';

const APP_BG = '#0A0F0D';

function enterFullscreen() {
  try {
    if (!requestFullscreen.isAvailable() || isFullscreen()) return;
    void Promise.resolve(requestFullscreen.ifAvailable()).catch(() => undefined);
  } catch (error) {
    if (import.meta.env.DEV) console.warn('[telegram] fullscreen skipped:', error);
  }
}

function tryRun(label: string, run: () => void) {
  try {
    run();
  } catch (error) {
    if (import.meta.env.DEV) console.warn(`[telegram] ${label} skipped:`, error);
  }
}

/**
 * Инициализация Telegram Mini App. Все вызовы защищены try/catch,
 * чтобы приложение поднималось и вне Telegram (для разработки/вёрстки).
 */
export async function initTelegram(): Promise<void> {
  tryRun('init', () => init());

  tryRun('miniApp', () => {
    mountMiniAppSync();
    bindMiniAppCssVars();
  });

  tryRun('themeParams', () => {
    mountThemeParamsSync();
    bindThemeParamsCssVars();
  });

  tryRun('backButton', () => mountBackButton());

  await (async () => {
    try {
      await mountViewport();
      expandViewport();
      bindViewportCssVars();
    } catch (error) {
      if (import.meta.env.DEV) console.warn('[telegram] viewport skipped:', error);
    }
  })();

  tryRun('colors', () => {
    setMiniAppHeaderColor(APP_BG);
    setMiniAppBackgroundColor(APP_BG);
  });

  tryRun('ready', () => miniAppReady());
  enterFullscreen();
  // Часть клиентов отклоняет fullscreen без жеста, если миниапп открыли не из меню бота.
  window.addEventListener('pointerdown', enterFullscreen, { capture: true, once: true });

  // Свайп вниз у верхнего края сворачивает Mini App. На обычных экранах это случайное закрытие.
  tryRun('verticalSwipes', () => {
    const webApp = (
      window as Window & { Telegram?: { WebApp?: { disableVerticalSwipes?: () => void } } }
    ).Telegram?.WebApp;
    webApp?.disableVerticalSwipes?.();
  });
}
