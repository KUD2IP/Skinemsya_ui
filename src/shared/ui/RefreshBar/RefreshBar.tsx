import { AnimatePresence, motion } from 'motion/react';
import { overlayFade, usePrefersReducedMotion } from '@/shared/lib';
import * as css from './RefreshBar.css';

export interface RefreshBarProps {
  active: boolean;
}

/** Ненавязчивый индикатор refetch: полоска в верхней safe-area, без текста. */
export function RefreshBar({ active }: RefreshBarProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          className={css.root}
          role="progressbar"
          aria-busy="true"
          aria-label="Обновление"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduced ? { duration: 0 } : overlayFade}
        >
          <div className={css.track}>
            <motion.div
              className={css.beam}
              animate={reduced ? undefined : { x: ['-110%', '320%'] }}
              transition={
                reduced
                  ? undefined
                  : { repeat: Infinity, duration: 1.05, ease: 'easeInOut' }
              }
            />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
