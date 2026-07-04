import { motion } from 'motion/react';
import * as css from './AppSplash.css';
import { vars } from '@/shared/theme';
import { usePrefersReducedMotion } from '@/shared/lib';

export interface AppSplashProps {
  layout?: 'overlay' | 'fill';
}

/**
 * Анимированный экран загрузки: монеты падают в общий «котёл».
 * layout="fill" — внутри AuthGate; layout="overlay" — самостоятельный fullscreen.
 */
export function AppSplash({ layout = 'overlay' }: AppSplashProps) {
  const reduced = usePrefersReducedMotion();

  const coins = [
    { cx: 80, delay: 0 },
    { cx: 64, delay: 0.35 },
    { cx: 96, delay: 0.7 },
  ];

  return (
    <div className={css.root({ layout })}>
      <svg className={css.stage} viewBox="0 0 160 160" fill="none" aria-hidden>
        <defs>
          <linearGradient id="potGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={vars.color.green[500]} />
            <stop offset="100%" stopColor={vars.color.accent} />
          </linearGradient>
        </defs>

        {!reduced &&
          coins.map((coin, i) => (
            <motion.circle
              key={i}
              cx={coin.cx}
              r="9"
              fill="url(#potGrad)"
              stroke={vars.color.bg.base}
              strokeWidth="2"
              initial={{ cy: 8, opacity: 0 }}
              animate={{ cy: [8, 92], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 1.1,
                delay: coin.delay,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: 'easeIn',
              }}
            />
          ))}

        <motion.g
          initial={reduced ? false : { scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ transformOrigin: '80px 110px' }}
        >
          <rect x="40" y="92" width="80" height="48" rx="20" fill="url(#potGrad)" />
          <rect x="70" y="86" width="20" height="6" rx="3" fill={vars.color.bg.base} opacity="0.85" />
          <circle cx="104" cy="116" r="4" fill={vars.color.bg.base} opacity="0.6" />
        </motion.g>
      </svg>

      <div className={css.textBlock}>
        <div className={css.wordmark}>Скинемся</div>
        <div className={css.tagline}>складываемся вместе</div>
      </div>

      <div className={css.pulse} />
    </div>
  );
}
