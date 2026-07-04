import { useVisualViewportLayout } from './useVisualViewportLayout';

/** Высота перекрытия экрана виртуальной клавиатурой (visualViewport). */
export function useKeyboardInset(): number {
  return useVisualViewportLayout().keyboardInset;
}
