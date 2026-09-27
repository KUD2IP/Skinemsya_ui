import { useId } from 'react';
import { motion } from 'motion/react';
import { vars } from '@/shared/theme';
import { usePrefersReducedMotion } from '@/shared/lib';
import { LOGO_BOTTOM, LOGO_CHECK, LOGO_TOP, LOGO_VIEWBOX } from '@/shared/ui/BrandLogo/logoLayers';
import * as css from './AppSplash.css';

export interface AppSplashProps {
  layout?: 'overlay' | 'fill';
}

const WORDMARK = 'Скинемся';
const easeOut = [0.22, 1, 0.36, 1] as const;

/**
 * Экран загрузки: две дуги знака сходятся, галочка штампуется, вспыхивает ореол.
 * layout="fill" — внутри AuthGate; layout="overlay" — самостоятельный fullscreen.
 */
export function AppSplash({ layout = 'overlay' }: AppSplashProps) {
  const reduced = usePrefersReducedMotion();
  const uid = useId().replace(/:/g, '');
  const gradId = `splash-grad-${uid}`;

  return (
    <div className={css.root({ layout })}>
      <div className={css.stage}>
        <motion.div
          className={css.halo}
          initial={reduced ? false : { opacity: 0, scale: 0.7 }}
          animate={
            reduced
              ? { opacity: 0.5 }
              : { opacity: [0, 0.95, 0.45], scale: [0.7, 1.12, 1] }
          }
          transition={reduced ? undefined : { duration: 0.7, delay: 0.36, ease: easeOut }}
        />

        <svg className={css.svg} viewBox={LOGO_VIEWBOX} role="img" aria-label="Скинемся">
          <defs>
            <linearGradient
              id={gradId}
              x1="250"
              y1="170"
              x2="780"
              y2="850"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor={vars.color.green[300]} />
              <stop offset="0.48" stopColor={vars.color.accent} />
              <stop offset="1" stopColor={vars.color.green[600]} />
            </linearGradient>
          </defs>

          <motion.path
            d={LOGO_TOP}
            fill={`url(#${gradId})`}
            initial={reduced ? false : { y: -170, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={reduced ? undefined : { duration: 0.4, ease: easeOut }}
          />
          <motion.path
            d={LOGO_BOTTOM}
            fill={`url(#${gradId})`}
            initial={reduced ? false : { y: 170, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={reduced ? undefined : { duration: 0.4, delay: 0.06, ease: easeOut }}
          />
          <motion.path
            d={LOGO_CHECK}
            fill={`url(#${gradId})`}
            // fill-box, иначе масштаб считался бы от начала viewBox и галочку уводило бы в сторону.
            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            initial={reduced ? false : { scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={
              reduced
                ? undefined
                : { type: 'spring', stiffness: 520, damping: 16, mass: 0.7, delay: 0.34 }
            }
          />
        </svg>
      </div>

      <div className={css.textBlock}>
        <div className={css.wordmark}>
          {WORDMARK.split('').map((letter, index) => (
            <motion.span
              // Буквы фиксированы, переупорядочивания нет.
              key={index}
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={
                reduced ? undefined : { duration: 0.26, delay: 0.5 + index * 0.03, ease: easeOut }
              }
            >
              {letter}
            </motion.span>
          ))}
        </div>
        <motion.div
          className={css.tagline}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduced ? undefined : { duration: 0.3, delay: 0.8 }}
        >
          складываемся вместе
        </motion.div>
      </div>

      <div className={css.pulse} />
    </div>
  );
}
