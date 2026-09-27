import { useEffect, useState } from 'react';
import { animate, useInView } from 'motion/react';
import type { RefObject } from 'react';
import { usePrefersReducedMotion } from '@/shared/lib';
import { easeOut } from './landingMotion';

/**
 * Считает число вверх, когда блок попадает во вьюпорт.
 * При prefers-reduced-motion сразу отдаёт конечное значение.
 */
export function useCountUp(target: number, ref: RefObject<Element | null>, duration = 1.35) {
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    if (!inView) return;

    const controls = animate(0, target, {
      duration,
      ease: easeOut,
      onUpdate: (latest) => setValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduced, target, duration]);

  return value;
}
