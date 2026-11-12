import { create } from 'zustand';
import { isApiError, registerAuthBridge } from '@/shared/api';
import type { ChatBootstrapResponse, TokenResponse } from '@/shared/api';
import { loginWithTelegram, refreshTokens } from '../api/auth.api';
import { getInitDataRaw } from '../lib/initData';

/** Обновляем access за минуту до истечения, не дожидаясь 401. */
const REFRESH_SKEW_MS = 60_000;

export type SessionStatus = 'idle' | 'authenticating' | 'authenticated' | 'error';

interface SessionState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  status: SessionStatus;
  error: string | null;
  pendingChatBootstrap: ChatBootstrapResponse | null;
  pendingCreateEventGroupId: number | null;
  pendingEventNavigation: { groupId: number; eventId: number } | null;
  login: (initData: string) => Promise<boolean>;
  /** Обновляет access, если он уже протух или протухнет в ближайшую минуту. */
  prepare: () => Promise<void>;
  refresh: () => Promise<boolean>;
  logout: () => void;
  consumeChatBootstrap: () => ChatBootstrapResponse | null;
  consumePendingCreateEventGroupId: () => number | null;
  consumePendingEventNavigation: () => { groupId: number; eventId: number } | null;
  setPendingEventNavigation: (nav: { groupId: number; eventId: number } | null) => void;
}

function applyTokens(
  set: (partial: Partial<SessionState>) => void,
  tokens: Pick<TokenResponse, 'accessToken' | 'refreshToken' | 'expiresIn'> &
    Partial<Pick<TokenResponse, 'chatBootstrap'>>,
  options?: { includeBootstrap?: boolean },
) {
  const partial: Partial<SessionState> = {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    expiresAt: Date.now() + tokens.expiresIn * 1000,
    status: 'authenticated',
    error: null,
  };
  if (options?.includeBootstrap) {
    partial.pendingChatBootstrap = tokens.chatBootstrap ?? null;
  }
  set(partial);
  if (partial.expiresAt != null) scheduleRefresh(partial.expiresAt);
}

/** Гарантирует, что одновременно идёт не более одного запроса на refresh. */
let refreshInFlight: Promise<boolean> | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function clearRefreshTimer() {
  if (refreshTimer != null) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

function scheduleRefresh(expiresAt: number) {
  clearRefreshTimer();
  const delay = expiresAt - Date.now() - REFRESH_SKEW_MS;
  if (delay <= 0) return;
  refreshTimer = setTimeout(() => {
    refreshTimer = null;
    void useSessionStore.getState().refresh();
  }, delay);
}

function tokenIsFresh(accessToken: string | null, expiresAt: number | null): boolean {
  return accessToken != null && expiresAt != null && Date.now() < expiresAt - REFRESH_SKEW_MS;
}

function dropSession(error: string) {
  clearRefreshTimer();
  useSessionStore.setState({
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
    status: 'error',
    error,
  });
}

async function runRefresh(refreshToken: string): Promise<boolean> {
  try {
    const tokens = await refreshTokens(refreshToken);
    applyTokens(useSessionStore.setState, tokens);
    return true;
  } catch (error) {
    // Сеть моргнула — refresh-токен ещё жив, следующий запрос попробует снова.
    if (!isApiError(error) || error.status !== 401) return false;
  }

  const initData = getInitDataRaw();
  if (!initData) {
    dropSession('Сессия истекла. Откройте приложение заново.');
    return false;
  }

  try {
    const tokens = await loginWithTelegram(initData);
    applyTokens(useSessionStore.setState, tokens);
    return true;
  } catch (error) {
    dropSession(error instanceof Error ? error.message : 'Сессия истекла. Откройте приложение заново.');
    return false;
  }
}

export const useSessionStore = create<SessionState>((set, get) => ({
  accessToken: null,
  refreshToken: null,
  expiresAt: null,
  status: 'idle',
  error: null,
  pendingChatBootstrap: null,
  pendingCreateEventGroupId: null,
  pendingEventNavigation: null,

  login: async (initData) => {
    set({ status: 'authenticating', error: null });
    try {
      const tokens = await loginWithTelegram(initData);
      applyTokens(set, tokens, { includeBootstrap: true });
      return true;
    } catch (error) {
      set({
        status: 'error',
        error: error instanceof Error ? error.message : 'Ошибка авторизации',
      });
      return false;
    }
  },

  prepare: async () => {
    const { accessToken, refreshToken, expiresAt } = get();
    if (!refreshToken || tokenIsFresh(accessToken, expiresAt)) return;
    await get().refresh();
  },

  refresh: () => {
    if (refreshInFlight) return refreshInFlight;
    const { refreshToken } = get();
    if (!refreshToken) return Promise.resolve(false);

    refreshInFlight = runRefresh(refreshToken).finally(() => {
      refreshInFlight = null;
    });
    return refreshInFlight;
  },

  logout: () => {
    clearRefreshTimer();
    set({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      status: 'idle',
      error: null,
      pendingChatBootstrap: null,
      pendingCreateEventGroupId: null,
      pendingEventNavigation: null,
    });
  },

  consumeChatBootstrap: () => {
    const bootstrap = get().pendingChatBootstrap;
    if (bootstrap) {
      const patch: Partial<SessionState> = { pendingChatBootstrap: null };
      if (bootstrap.suggestedAction === 'CREATE_EVENT') {
        patch.pendingCreateEventGroupId = bootstrap.groupId;
      }
      if (bootstrap.eventId != null) {
        patch.pendingEventNavigation = { groupId: bootstrap.groupId, eventId: bootstrap.eventId };
      }
      set(patch);
    }
    return bootstrap;
  },

  consumePendingCreateEventGroupId: () => {
    const groupId = get().pendingCreateEventGroupId;
    if (groupId != null) set({ pendingCreateEventGroupId: null });
    return groupId;
  },

  consumePendingEventNavigation: () => {
    const nav = get().pendingEventNavigation;
    if (nav) set({ pendingEventNavigation: null });
    return nav;
  },

  setPendingEventNavigation: (nav) => set({ pendingEventNavigation: nav }),
}));

// Связываем HTTP-клиент с сессией без обратной зависимости shared -> features.
registerAuthBridge({
  getAccessToken: () => useSessionStore.getState().accessToken,
  prepare: () => useSessionStore.getState().prepare(),
  refresh: () => useSessionStore.getState().refresh(),
});
