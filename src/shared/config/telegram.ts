/** Username бота без @ — задаётся через VITE_TELEGRAM_BOT_USERNAME. */
export const TELEGRAM_BOT_USERNAME = import.meta.env.VITE_TELEGRAM_BOT_USERNAME?.trim() ?? '';

/** Short name Mini App из BotFather — опционально, для t.me/bot/shortName. */
export const TELEGRAM_MINI_APP_SHORT_NAME =
  import.meta.env.VITE_TELEGRAM_MINI_APP_SHORT_NAME?.trim() ?? '';

/** Ссылка для открытия бота / Mini App. null — если username не задан. */
export function getTelegramOpenUrl(): string | null {
  if (!TELEGRAM_BOT_USERNAME) return null;
  if (TELEGRAM_MINI_APP_SHORT_NAME) {
    return `https://t.me/${TELEGRAM_BOT_USERNAME}/${TELEGRAM_MINI_APP_SHORT_NAME}`;
  }
  return `https://t.me/${TELEGRAM_BOT_USERNAME}`;
}

/** Публичный канал. Переопределяется через VITE_TELEGRAM_CHANNEL_URL. */
export const TELEGRAM_CHANNEL_URL =
  import.meta.env.VITE_TELEGRAM_CHANNEL_URL?.trim() || 'https://t.me/skinemsya_vse';

/** @username из ссылки на канал, для подписи в футере. */
export function getTelegramChannelHandle(url: string): string | null {
  try {
    const name = new URL(url).pathname.split('/').filter(Boolean)[0];
    return name ? `@${name}` : null;
  } catch {
    return null;
  }
}

/** Почта для футера лендинга. */
export const SUPPORT_EMAIL = import.meta.env.VITE_SUPPORT_EMAIL?.trim() ?? '';
