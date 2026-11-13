import { useEffect, useRef } from 'react';
import {
  hideBackButton,
  isBackButtonVisible,
  onBackButtonClick,
  retrieveRawInitData,
  showBackButton,
} from '@telegram-apps/sdk-react';

type BackHandler = () => void;

let handler: BackHandler | null = null;
let owner: symbol | null = null;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

function inTelegram(): boolean {
  try {
    return Boolean(retrieveRawInitData());
  } catch {
    return false;
  }
}

function showArrow() {
  try {
    if (isBackButtonVisible()) return;
    showBackButton();
  } catch {
    // Вне Telegram или до mount кнопки управление системной стрелкой недоступно.
  }
}

function claim(id: symbol, next: BackHandler) {
  owner = id;
  handler = next;
  if (hideTimer != null) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  // Повторный show() заставляет Telegram заново проиграть смену крестика на стрелку.
  showArrow();
}

function release(id: symbol) {
  if (owner !== id) return;
  owner = null;
  handler = null;
  if (hideTimer != null) clearTimeout(hideTimer);
  // Прятать сразу нельзя: следующий экран ещё не успел забрать кнопку, и на её месте вспыхивает крестик.
  hideTimer = setTimeout(() => {
    hideTimer = null;
    if (owner != null) return;
    try {
      hideBackButton();
    } catch {
      // Кнопка уже скрыта или клиент её не поддерживает.
    }
  }, 0);
}

/** Слушатель системной стрелки. Вешается один раз на всё приложение. */
export function bindTelegramBackButton(): () => void {
  try {
    return onBackButtonClick(() => {
      handler?.();
    });
  } catch {
    return () => undefined;
  }
}

/**
 * В Telegram показывает системную стрелку вместо «Закрыть» и вызывает onBack.
 * Вне Telegram возвращает false — на странице остаётся своя кнопка.
 */
export function useTelegramBack(onBack: BackHandler): boolean {
  const native = inTelegram();
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  useEffect(() => {
    if (!native) return undefined;
    const id = Symbol();
    claim(id, () => onBackRef.current());
    return () => release(id);
  }, [native]);

  return native;
}
