/**
 * Базовый URL API.
 * По умолчанию — относительный путь на том же origin, что и фронт.
 * В dev это работает через прокси Vite (`/api` -> бэкенд), без CORS и второго туннеля.
 * Переопределяется переменной VITE_API_BASE_URL (например, для прод-сборки).
 */
const sameOriginFallback =
  typeof window !== 'undefined'
    ? `${window.location.origin}/api/v1`
    : 'http://localhost:8080/api/v1';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? sameOriginFallback;
