import { createContext, useContext } from 'react';
import type { RefObject } from 'react';

/**
 * Лендинг скроллится во внутреннем контейнере (`html, body, #root` зафиксированы по высоте),
 * поэтому scroll-анимациям нужен явный ref на этот контейнер.
 */
export const LandingScrollContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

export function useLandingScrollRef() {
  return useContext(LandingScrollContext);
}
