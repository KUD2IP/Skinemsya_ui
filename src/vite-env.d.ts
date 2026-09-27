/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_TELEGRAM_BOT_USERNAME?: string;
  readonly VITE_TELEGRAM_MINI_APP_SHORT_NAME?: string;
  readonly VITE_TELEGRAM_CHANNEL_URL?: string;
  readonly VITE_SUPPORT_EMAIL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '@fontsource-variable/onest';
declare module '@fontsource-variable/geologica';
declare module '@fontsource-variable/jetbrains-mono';
