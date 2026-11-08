import { retrieveLaunchParams, retrieveRawInitData } from '@telegram-apps/sdk-react';

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
