import { create } from 'zustand';
import { registerAuthBridge } from '@/shared/api';
import type { ChatBootstrapResponse, TokenResponse } from '@/shared/api';
import { loginWithTelegram, refreshTokens } from '../api/auth.api';

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
}

/** Гарантирует, что одновременно идёт не более одного запроса на refresh. */
let refreshInFlight: Promise<boolean> | null = null;

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

  refresh: async () => {
    if (refreshInFlight) return refreshInFlight;
    const { refreshToken } = get();
    if (!refreshToken) return false;

    refreshInFlight = (async () => {
      try {
        const tokens = await refreshTokens(refreshToken);
        applyTokens(set, tokens);
        return true;
      } catch {
        set({ accessToken: null, refreshToken: null, expiresAt: null, status: 'idle' });
        return false;
      } finally {
        refreshInFlight = null;
      }
    })();

    return refreshInFlight;
  },

  logout: () => {
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
  refresh: () => useSessionStore.getState().refresh(),
});
