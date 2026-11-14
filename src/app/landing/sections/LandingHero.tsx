import { motion } from 'motion/react';
import { ArrowDown, Check } from '@phosphor-icons/react';
import { formatMoney, usePrefersReducedMotion } from '@/shared/lib';
import { LandingCta } from '../components/LandingCta';
import { LandingReceipt } from '../components/LandingReceipt';
import { LandingSection } from '../components/LandingSection';
import { landingItem, landingStagger } from '../lib/landingMotion';
import { DINNER, DINNER_SHARES } from '../lib/storyData';
import * as css from './LandingHero.css';

export function LandingHero() {
  const reduced = usePrefersReducedMotion();

  return (
    <LandingSection className={css.hero}>
      <div className={css.grid}>
        <motion.div
          className={css.copy}
          variants={reduced ? undefined : landingStagger}
          initial={reduced ? false : 'hidden'}
          animate={reduced ? undefined : 'visible'}
        >
          <motion.p className={css.stamp} variants={reduced ? undefined : landingItem}>
            <span className={css.stampDot} aria-hidden />
            {DINNER.when} · ужин на четверых
          </motion.p>
          <motion.h1 className={css.title} variants={reduced ? undefined : landingItem}>
            <span className={css.titleLine}>Один ужин.</span>
            <span className={css.titleLine}>Четыре доли.</span>
            <span className={css.titleAccent}>Ноль калькуляторов.</span>
          </motion.h1>
          <motion.p className={css.subtitle} variants={reduced ? undefined : landingItem}>
            Загрузите чек или добавьте позиции вручную. Каждый отметит своё, а Скинемся покажет,
            кому и сколько перевести. Прямо в Telegram.
          </motion.p>
          <motion.div className={css.ctaBlock} variants={reduced ? undefined : landingItem}>
            <LandingCta size="lg" showHint={false} fullWidth />
            <p className={css.trust}>Деление вручную — бесплатно · без отдельного приложения</p>
          </motion.div>
          <motion.a
            className={css.scrollHint}
            href="#story"
            variants={reduced ? undefined : landingItem}
          >
            <span>Посмотреть, как делится чек</span>
            <ArrowDown size={16} weight="bold" />
          </motion.a>
        </motion.div>

        <motion.div
          className={css.visual}
          variants={reduced ? undefined : landingItem}
          initial={reduced ? false : 'hidden'}
          animate={reduced ? undefined : 'visible'}
        >
          <figure className={css.board}>
            <div className={css.receipt}>
              <LandingReceipt />
            </div>
            <div className={css.settlement}>
              <div className={css.settlementHead}>
                <span>Разделено</span>
                <span>4 / 4</span>
              </div>
              <div className={css.shares}>
                {DINNER_SHARES.map((share, index) => (
                  <div className={css.share} key={share.name}>
                    <span className={css.shareIndex}>0{index + 1}</span>
                    <span className={css.shareName}>
                      {share.name}
                      {share.name === DINNER.payer ? (
                        <span className={css.payerNote}>платил за всех</span>
                      ) : null}
                    </span>
                    <span className={css.shareAmount}>{formatMoney(share.amount)}</span>
                  </div>
                ))}
              </div>
              <div className={css.settlementTotal}>
                <span className={css.settlementCheck}>
                  <Check size={16} weight="bold" aria-hidden />
                  Сходится с чеком
                </span>
                <span>{formatMoney(DINNER.total)}</span>
              </div>
            </div>
            <figcaption className={css.caption}>
              Свои позиции + равная доля общих. Всё складывается автоматически.
            </figcaption>
          </figure>
        </motion.div>
      </div>
    </LandingSection>
  );
}
