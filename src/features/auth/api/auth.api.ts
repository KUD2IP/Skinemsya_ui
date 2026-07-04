import { api, toApiError } from '@/shared/api';
import type {
  RefreshTokenRequest,
  TelegramAuthRequest,
  TokenResponse,
} from '@/shared/api';

export async function loginWithTelegram(initData: string): Promise<TokenResponse> {
  try {
    return await api
      .post('auth/telegram', { json: { initData } satisfies TelegramAuthRequest })
      .json<TokenResponse>();
  } catch (error) {
    throw await toApiError(error);
  }
}

export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  try {
    return await api
      .post('auth/refresh', { json: { refreshToken } satisfies RefreshTokenRequest })
      .json<TokenResponse>();
  } catch (error) {
    throw await toApiError(error);
  }
}
