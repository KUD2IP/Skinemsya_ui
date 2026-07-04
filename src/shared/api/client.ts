import ky from 'ky';
import { API_BASE_URL } from '@/shared/config';
import { getAccessToken, refreshSession } from './authBridge';

/** Эндпоинты авторизации не должны получать Bearer и не должны триггерить рефреш. */
function isAuthPath(url: string): boolean {
  return url.includes('/auth/');
}

export const api = ky.create({
  prefix: API_BASE_URL,
  retry: 0,
  timeout: 15000,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        if (isAuthPath(request.url)) return;
        const token = getAccessToken();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async ({ request, response }) => {
        if (response.status !== 401 || isAuthPath(request.url)) return response;

        const refreshed = await refreshSession();
        if (!refreshed) return response;

        const token = getAccessToken();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
        return ky(request);
      },
    ],
  },
});
