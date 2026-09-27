import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { landingScrollSpring } from '../lib/landingMotion';
import { ArrowDown } from '@phosphor-icons/react';
import { usePrefersReducedMotion } from '@/shared/lib';
import { LandingCta } from '../components/LandingCta';
import { LandingDemo } from '../components/LandingDemo';
import { LandingPhone } from '../components/LandingPhone';
import { LandingReceipt } from '../components/LandingReceipt';
import { LandingSection } from '../components/LandingSection';
import { landingItem, landingStagger } from '../lib/landingMotion';
import { useLandingScrollRef } from '../lib/scrollRoot';
import { useCountUp } from '../lib/useCountUp';
import { DINNER } from '../lib/storyData';
import * as css from './LandingHero.css';

const TOTAL_RUB = DINNER.total / 100;

export function LandingHero() {
  const reduced = usePrefersReducedMotion();
  const scrollRef = useLandingScrollRef();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    container: scrollRef ?? undefined,
    offset: ['start start', 'end start'],
  });
  const smoothScroll = useSpring(scrollYProgress, landingScrollSpring);
  const receiptY = useTransform(smoothScroll, [0, 1], ['0px', '-64px']);
  const phoneY = useTransform(smoothScroll, [0, 1], ['0px', '32px']);
  const phoneTilt = useTransform(smoothScroll, [0, 1], ['-5deg', '2deg']);

  const counted = useCountUp(TOTAL_RUB, sectionRef);
  const amount = `${counted.toLocaleString('ru-RU')}\u00A0₽`;

  return (
    <LandingSection className={css.hero}>
      <div className={css.grid} ref={sectionRef}>
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
            <span className={css.titleAmount}>{amount}</span> на четверых.{' '}
            <span className={css.titleAccent}>Никто не считал вручную.</span>
          </motion.h1>
          <motion.p className={css.subtitle} variants={reduced ? undefined : landingItem}>
            Скинемся — в Telegram для совместных трат. Создаёте сбор, каждый отмечает свою долю — с
            чека или вручную — и сразу видно, кому сколько перевести и кто уже скинул.
          </motion.p>
          <motion.div className={css.ctaBlock} variants={reduced ? undefined : landingItem}>
            <LandingCta size="lg" showHint={false} fullWidth />
            <p className={css.trust}>
              Открывается в Telegram · на наш пример ушло около трёх минут
            </p>
          </motion.div>
          <motion.a
            className={css.scrollHint}
            href="#story"
            variants={reduced ? undefined : landingItem}
          >
            <span>Как это выглядело в тот вечер</span>
            <ArrowDown size={16} weight="bold" />
          </motion.a>
        </motion.div>

        <div className={css.visual}>
          <div className={css.visualStack}>
            <motion.div className={css.receipt} style={reduced ? undefined : { y: receiptY }}>
              <LandingReceipt limit={5} />
            </motion.div>
            <motion.div
              className={css.phoneWrap}
              style={reduced ? undefined : { y: phoneY, rotateY: phoneTilt }}
            >
              <div className={css.glow} aria-hidden />
              <LandingPhone>
                <LandingDemo variant="payer" />
              </LandingPhone>
            </motion.div>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
