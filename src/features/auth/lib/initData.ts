import { retrieveLaunchParams, retrieveRawInitData } from '@telegram-apps/sdk-react';

/** Возвращает сырую строку initData из Telegram или null вне Telegram. */
export function getInitDataRaw(): string | null {
  try {
    return retrieveRawInitData() ?? null;
  } catch {
    return null;
  }
}

const EVENT_PREFIX = 'event_';

/** Парсит eventId из start_param (формат event_{id}). */
export function parseEventIdFromStartParam(startParam: string | null | undefined): number | null {
  if (!startParam?.startsWith(EVENT_PREFIX)) return null;
  const id = Number.parseInt(startParam.slice(EVENT_PREFIX.length), 10);
  return Number.isFinite(id) && id > 0 ? id : null;
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
