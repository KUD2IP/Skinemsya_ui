import { create } from 'zustand';

/** Счётчик открытых шторок — прячем TabBar и блокируем фон. */
export const useOverlayStore = create<{
  sheetCount: number;
  registerSheet: () => void;
  unregisterSheet: () => void;
}>((set) => ({
  sheetCount: 0,
  registerSheet: () => set((s) => ({ sheetCount: s.sheetCount + 1 })),
  unregisterSheet: () => set((s) => ({ sheetCount: Math.max(0, s.sheetCount - 1) })),
}));

export function useAnySheetOpen(): boolean {
  return useOverlayStore((s) => s.sheetCount > 0);
}

/** Сброс overlay при смене маршрута (защита от залипшего backdrop). */
export function resetOverlayState(): void {
  useOverlayStore.setState({ sheetCount: 0 });
}
