/**
 * Мост между HTTP-клиентом (shared) и фичей авторизации (features/auth),
 * чтобы shared не импортировал features напрямую.
 * Фича auth регистрирует здесь доступ к токену и обработчик 401.
 */
interface AuthBridge {
  getAccessToken: () => string | null;
  /** Обновляет access, если до истечения меньше минуты или токена уже нет. */
  prepare: () => Promise<void>;
  /** Пытается обновить сессию. true — токен обновлён, можно повторить запрос. */
  refresh: () => Promise<boolean>;
}

let bridge: AuthBridge = {
  getAccessToken: () => null,
  prepare: async () => undefined,
  refresh: async () => false,
};

export function registerAuthBridge(next: AuthBridge): void {
  bridge = next;
}

export function getAccessToken(): string | null {
  return bridge.getAccessToken();
}

export function prepareSession(): Promise<void> {
  return bridge.prepare();
}

export function refreshSession(): Promise<boolean> {
  return bridge.refresh();
}
