import { retrieveLaunchParams, retrieveRawInitData } from '@telegram-apps/sdk-react';

/** HTTPS-адрес аватарки из подписанного initData. Telegram отдаёт его не всегда. */
export function telegramPhotoUrl(): string | null {
  const raw = getInitDataRaw();
  if (!raw) return null;
  try {
    const userJson = new URLSearchParams(raw).get('user');
    if (!userJson) return null;
    const user = JSON.parse(userJson) as { photo_url?: unknown };
    return httpsPhotoUrl(user.photo_url);
  } catch {
    return null;
  }
}

function httpsPhotoUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const url = value.trim();
  if (!url.startsWith('https://') || url.length > 1024) return null;
  return url;
}

/** Возвращает сырую строку initData из Telegram или null вне Telegram. */
export function getInitDataRaw(): string | null {
  try {
    return retrieveRawInitData() ?? null;
  } catch {
    return null;
  }
}

/**
 * Номер сбора в ссылке больше не передаётся: вход только по коду, который знает сервер.
 * Навигацию после приглашения даёт ответ авторизации.
 */
export function parseEventIdFromStartParam(_startParam: string | null | undefined): number | null {
  return null;
}

/** Парсит eventId из start_param в initData (формат event_{id}). */
export function parseEventIdFromInitData(initData: string | null): number | null {
  if (!initData) return null;
  try {
    const params = new URLSearchParams(initData);
    return parseEventIdFromStartParam(params.get('start_param'));
  } catch {
    return null;
  }
}

/** eventId из initData или tgWebAppStartParam (deep link «Скинуть»). */
export function resolveEventIdFromTelegram(): number | null {
  const fromInitData = parseEventIdFromInitData(getInitDataRaw());
  if (fromInitData != null) return fromInitData;
  try {
    const { tgWebAppStartParam } = retrieveLaunchParams();
    return parseEventIdFromStartParam(tgWebAppStartParam);
  } catch {
    return null;
  }
}
