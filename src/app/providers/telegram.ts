import {
  bindMiniAppCssVars,
  bindThemeParamsCssVars,
  bindViewportCssVars,
  expandViewport,
  init,
  miniAppReady,
  mountBackButton,
  mountMiniAppSync,
  mountThemeParamsSync,
  mountViewport,
  setMiniAppBackgroundColor,
  setMiniAppHeaderColor,
} from '@telegram-apps/sdk-react';

const APP_BG = '#0A0F0D';

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
}
