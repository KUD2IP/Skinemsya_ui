import { create } from 'zustand';

export type ToastTone = 'success' | 'warning' | 'danger' | 'neutral';

export interface ToastItem {
  id: string;
  tone: ToastTone;
  message: string;
  duration: number;
  /** Счётчик обновлений — сбрасывает таймер без remount. */
  revision: number;
}

interface ToastState {
  toast: ToastItem | null;
  push: (toast: Omit<ToastItem, 'id' | 'revision'>) => string;
  dismiss: () => void;
}

const DEFAULT_DURATION: Record<ToastTone, number> = {
  success: 2200,
  warning: 3200,
  danger: 4000,
  neutral: 2800,
};

export const useToastStore = create<ToastState>((set, get) => ({
  toast: null,
  push: (toast) => {
    set((state) => {
      const revision = (state.toast?.revision ?? 0) + 1;
      const id = state.toast?.id ?? crypto.randomUUID();
      return { toast: { ...toast, id, revision } };
    });
    return get().toast!.id;
  },
  dismiss: () => set({ toast: null }),
}));

function show(message: string, tone: ToastTone, duration = DEFAULT_DURATION[tone]) {
  return useToastStore.getState().push({ message, tone, duration });
}

/** Императивный API тостов для использования вне React-компонентов. */
export const toast = {
  /** Короткое подтверждение сохранения. */
  saved: (message = 'Сохранено') => show(message, 'success'),
  success: (message: string) => show(message, 'success'),
  error: (message: string) => show(message, 'danger'),
  warning: (message: string) => show(message, 'warning'),
  info: (message: string) => show(message, 'neutral'),
};
