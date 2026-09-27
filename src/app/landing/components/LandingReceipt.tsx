import { motion } from 'motion/react';
import { formatMoney } from '@/shared/lib';
import { usePrefersReducedMotion } from '@/shared/lib';
import { receiptLeader, receiptLine, receiptRoll } from '../lib/landingMotion';
import { DINNER, DINNER_ITEMS } from '../lib/storyData';
import * as css from './LandingReceipt.css';

export interface LandingReceiptProps {
  /** Сколько позиций показать. По умолчанию — все. */
  limit?: number;
  className?: string;
}

/** Бумажный чек: строки «печатаются» сверху вниз, выноски дорисовываются. */
export function LandingReceipt({ limit, className }: LandingReceiptProps) {
  const reduced = usePrefersReducedMotion();
  const items = limit != null ? DINNER_ITEMS.slice(0, limit) : DINNER_ITEMS;

  return (
    <motion.div
      className={className != null ? `${css.root} ${className}` : css.root}
      aria-hidden
      variants={reduced ? undefined : receiptRoll}
      initial={reduced ? false : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, margin: '-10% 0px' }}
    >
      <motion.div className={css.head} variants={reduced ? undefined : receiptLine}>
        <span className={css.place}>{DINNER.title}</span>
        <span className={css.when}>{DINNER.when}</span>
      </motion.div>
      <div className={css.rows}>
        {items.map((item) => (
          <motion.div
            className={css.row}
            key={item.name}
            variants={reduced ? undefined : receiptLine}
          >
            <span className={css.name}>
              {item.name}
              {item.qty > 1 ? ` ×${item.qty}` : null}
            </span>
            <motion.span
              className={css.leader}
              variants={reduced ? undefined : receiptLeader}
            />
            <span className={css.value}>{formatMoney(item.total)}</span>
          </motion.div>
        ))}
      </div>
      <motion.div className={css.total} variants={reduced ? undefined : receiptLine}>
        <span>ИТОГО</span>
        <span className={css.totalValue}>{formatMoney(DINNER.total)}</span>
      </motion.div>
    </motion.div>
  );
}
