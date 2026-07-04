import { HTTPError, TimeoutError } from 'ky';
import type { ApiErrorResponse } from './dto';

export class ApiError extends Error {
  readonly code: ApiErrorResponse['code'];
  readonly status: number;
  readonly fields?: ApiErrorResponse['fields'];
  readonly correlationId?: string;

  constructor(payload: ApiErrorResponse, status: number) {
    super(payload.message);
    this.name = 'ApiError';
    this.code = payload.code;
    this.status = status;
    this.fields = payload.fields;
    this.correlationId = payload.correlationId;
  }
}

const FALLBACK: ApiErrorResponse = {
  code: 'INTERNAL_ERROR',
  message: 'Что-то пошло не так. Попробуйте ещё раз.',
};

const NETWORK: ApiErrorResponse = {
  code: 'INTEGRATION_ERROR',
  message: 'Нет связи с сервером. Проверьте адрес API и CORS на бэкенде.',
};

const TIMEOUT: ApiErrorResponse = {
  code: 'INTEGRATION_ERROR',
  message: 'Сервер не отвечает. Попробуйте ещё раз.',
};

/** Превращает любую ошибку ky/fetch в типизированный ApiError. */
export async function toApiError(error: unknown): Promise<ApiError> {
  if (import.meta.env.DEV) console.error('[api] request failed:', error);

  if (error instanceof HTTPError) {
    let payload = FALLBACK;
    try {
      payload = (await error.response.json()) as ApiErrorResponse;
    } catch {
      /* тело не JSON — используем фолбэк */
    }
    return new ApiError(payload, error.response.status);
  }

  if (error instanceof TimeoutError) {
    return new ApiError(TIMEOUT, 0);
  }

  // TypeError "Failed to fetch" — сеть недоступна или запрос заблокирован CORS.
  if (error instanceof TypeError) {
    return new ApiError(NETWORK, 0);
  }

  return new ApiError(FALLBACK, 0);
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
