import { useEffect, type RefObject } from 'react';

/** will-change: transform только на время анимации — не держим лишний GPU-layer постоянно. */
export function useTransientWillChange(
  ref: RefObject<HTMLElement | null>,
  trigger: unknown,
  durationMs = 400,
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.willChange = 'transform';
    const timer = window.setTimeout(() => {
      el.style.willChange = '';
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
      el.style.willChange = '';
    };
  }, [ref, trigger, durationMs]);
}
