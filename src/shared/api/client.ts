import ky from 'ky';
import { API_BASE_URL } from '@/shared/config';
import { getAccessToken, prepareSession, refreshSession } from './authBridge';

/** Эндпоинты авторизации не должны получать Bearer и не должны триггерить рефреш. */
function isAuthPath(url: string): boolean {
  return url.includes('/auth/');
}

export const api = ky.create({
  prefix: API_BASE_URL,
  // Автоповтор выключен. limit: 1 нужен только для принудительного ky.retry после 401.
  retry: {
    limit: 1,
    methods: [],
    statusCodes: [],
  },
  // На слабом VPS OCR легко >15 с. Дефолт ky иначе даёт TimeoutError
  // «Сервер не отвечает», хотя бек уже сохранил позиции.
  timeout: 180_000,
  hooks: {
    beforeRequest: [
      async ({ request }) => {
        if (isAuthPath(request.url)) return;
        await prepareSession();
        const token = getAccessToken();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async ({ request, response, retryCount }) => {
        if (response.status !== 401 || isAuthPath(request.url) || retryCount > 0) return response;

        const refreshed = await refreshSession();
        if (!refreshed) return response;

        const headers = new Headers(request.headers);
        const token = getAccessToken();
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return ky.retry({
          request: new Request(request, { headers }),
          delay: 0,
          code: 'TOKEN_REFRESHED',
        });
      },
    ],
  },
});
