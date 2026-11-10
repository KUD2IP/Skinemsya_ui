import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { usePrefersReducedMotion } from '@/shared/lib';
import * as css from './ReceiptParseStage.css';

const LINES = [
  'Считаем, сколько миллионов вы потратили',
  'Смотрим, сколько пива было выпито',
  'Учитываем, какой шот был добивающим',
  'Ищем строку, которую никто не признает своей',
  'Отделяем закуску от «ещё по одной»',
  'Проверяем, не затесался ли в чек чужой десерт',
  'Считаем, кому достанется последний ролл',
  'Выясняем, кто заказал воду и не пил её',
  'Сверяем, сколько раз коктейль был «только один»',
  'Ищем чаевые, которые уже больше ужина',
  'Смотрим, не оплачен ли заодно соседний стол',
  'Откладываем то, что заказывали на всех',
  'Считаем шаурму, которую взяли по дороге',
  'Проверяем, чей был двойной эспрессо',
  'Вычитаем лёд, который всё равно растаял',
  'Ищем позицию «просто попробовать»',
] as const;

const BARS = ['78%', '46%', '88%', '34%', '62%', '52%'];
const LINE_MS = 3400;

export function ReceiptParseStage() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % LINES.length);
    }, LINE_MS);
    return () => window.clearInterval(timer);
  }, [reduced]);

  return (
    <div className={css.stage} role="status" aria-busy="true" aria-label="Читаем чек">
      <div className={css.halo} aria-hidden />
      <div className={css.paper} aria-hidden>
        <span className={css.beam} />
        <div className={css.head}>
          <span className={css.headLine} />
          <span className={css.headLineShort} />
        </div>
        <div className={css.rows}>
          {BARS.map((width, row) => (
            <span
              key={width}
              className={css.row}
              style={{ width, animationDelay: `${row * 0.28}s` }}
            />
          ))}
        </div>
        <div className={css.total}>
          <span className={css.totalBar} />
          <span className={css.totalBar} />
        </div>
      </div>
      <div className={css.copy}>
        <div className={css.phraseSlot}>
          <AnimatePresence initial={false}>
            <motion.p
              key={index}
              className={css.phrase}
              aria-live="polite"
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.72, ease: [0.4, 0, 0.2, 1] }}
            >
              {LINES[index]}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className={css.hint}>Читаем чек, обычно несколько секунд</p>
        <span className={css.track} aria-hidden>
          <span className={css.trackFill} />
        </span>
      </div>
    </div>
  );
}
