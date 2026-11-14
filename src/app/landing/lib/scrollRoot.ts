import { createContext, useContext } from 'react';
import type { MouseEvent, RefObject } from 'react';
import { usePrefersReducedMotion } from '@/shared/lib';

/**
 * Лендинг скроллится во внутреннем контейнере (`html, body, #root` зафиксированы по высоте),
 * поэтому scroll-анимациям нужен явный ref на этот контейнер.
 */
export const LandingScrollContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useLandingScrollRef() {
  return useContext(LandingScrollContext);
}

export function useLandingScrollToTop() {
  const scrollRef = useLandingScrollRef();
  const reduced = usePrefersReducedMotion();

  return (event: MouseEvent<HTMLAnchorElement>) => {
    const root = scrollRef?.current;
    if (!root) return;

    event.preventDefault();
    root.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };
}
