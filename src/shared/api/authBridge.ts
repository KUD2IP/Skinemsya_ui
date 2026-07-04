/**
 * Мост между HTTP-клиентом (shared) и фичей авторизации (features/auth),
 * чтобы shared не импортировал features напрямую.
 * Фича auth регистрирует здесь доступ к токену и обработчик 401.
 */
interface AuthBridge {
  getAccessToken: () => string | null;
  /** Пытается обновить сессию. true — токен обновлён, можно повторить запрос. */
  refresh: () => Promise<boolean>;
}

let bridge: AuthBridge = {
  getAccessToken: () => null,
  refresh: async () => false,
};

export function registerAuthBridge(next: AuthBridge): void {
  bridge = next;
}

export function getAccessToken(): string | null {
  return bridge.getAccessToken();
}

export function refreshSession(): Promise<boolean> {
  return bridge.refresh();
}
