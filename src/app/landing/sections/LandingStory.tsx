import { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'motion/react';
import { cx, useMediaQuery, usePrefersReducedMotion } from '@/shared/lib';
import { LandingDemo } from '../components/LandingDemo';
import type { LandingDemoVariant } from '../components/LandingDemo';
import { LandingPhone } from '../components/LandingPhone';
import { LandingReveal } from '../components/LandingReveal';
import { LandingSection } from '../components/LandingSection';
import { landingBeatFade, landingScreenSwap, landingScrollSpring } from '../lib/landingMotion';
import { useLandingScrollRef } from '../lib/scrollRoot';
import * as css from './LandingStory.css';

interface Beat {
  time: string;
  title: string;
  text: string;
  factLabel: string;
  fact: string;
  variant: LandingDemoVariant;
}

const BEATS: Beat[] = [
  {
    time: '21:40',
    title: 'Собрали позиции',
    text: 'Марк собрал список трат. Можно загрузить чек — позиции появятся из него. Можно добавить их вручную: ужин, парк, такси.',
    factLabel: 'В списке',
    fact: '8 позиций',
    variant: 'positions',
  },
  {
    time: '21:45',
    title: 'Каждый отметил своё',
    text: 'Аня взяла две Калифорнии и одну гёдзу. Чай пили все — он помечен «На всех» и разделился сам, без обсуждений.',
    factLabel: 'У Ани вышло',
    fact: '1 480 ₽',
    variant: 'picks',
  },
  {
    time: '21:47',
    title: 'Видно, кто сколько скидывает',
    text: 'Марк платил за всех и теперь видит три суммы со статусами. Не нужно листать переписку и сверять, кто уже перевёл.',
    factLabel: 'Собирается Марку',
    fact: '3 350 ₽',
    variant: 'payer',
  },
  {
    time: '21:52',
    title: 'Перевели и подтвердили',
    text: 'Реквизиты Марка уже на экране — перевод обычный, через банк. Аня нажала «Отправил», Марк подтвердил получение.',
    factLabel: 'Напоминаний в чате',
    fact: '0',
    variant: 'pay',
  },
];

export function LandingStory() {
  const reduced = usePrefersReducedMotion();
  const timelineFocus = useMediaQuery('(min-width: 1024px)');
  const scrollRef = useLandingScrollRef();
  const beatsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: beatsRef,
    container: scrollRef ?? undefined,
    offset: ['start 70%', 'end 60%'],
  });
  const smoothScroll = useSpring(scrollYProgress, landingScrollSpring);
  const railScale = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.75 });
  const phoneTilt = useTransform(smoothScroll, [0, 1], ['-4deg', '4deg']);

  const activeVariant = BEATS[active].variant;

  return (
    <LandingSection id="story">
      <LandingReveal className={css.intro}>
        <h2 className={css.introTitle}>Как прошёл тот вечер</h2>
        <p className={css.introText}>
          Ниже — ужин на четверых. Тот же путь у любого сбора: позиции, доли каждого и подтверждённые
          переводы.
        </p>
      </LandingReveal>

      <div className={css.grid}>
        <div className={css.beats} ref={beatsRef}>
          <span className={css.rail} aria-hidden>
            <motion.span
              className={css.railFill}
              style={reduced ? { transform: 'scaleY(1)' } : { scaleY: railScale }}
            />
          </span>

          {BEATS.map((beat, index) => (
            <motion.div
              key={beat.variant}
              className={css.beat}
              animate={
                reduced || !timelineFocus
                  ? undefined
                  : { opacity: index === active ? 1 : 0.36 }
              }
              transition={reduced || !timelineFocus ? undefined : landingBeatFade}
              onViewportEnter={reduced ? undefined : () => setActive(index)}
              viewport={{ margin: '-40% 0px -40% 0px' }}
            >
              <span className={css.beatTime}>
                <span
                  className={cx(css.beatDot, index <= active && css.beatDotActive)}
                  aria-hidden
                />
                {beat.time}
              </span>
              <div className={css.beatBody}>
                <h3 className={css.beatTitle}>{beat.title}</h3>
                <p className={css.beatText}>{beat.text}</p>
                <p className={css.beatFact}>
                  <span className={css.beatFactLabel}>{beat.factLabel}</span>
                  <span>{beat.fact}</span>
                </p>
              </div>
              <div className={cx(css.beatPhone, reduced && css.beatPhoneForced)}>
                <LandingPhone>
                  <LandingDemo variant={beat.variant} />
                </LandingPhone>
              </div>
            </motion.div>
          ))}
        </div>

        {reduced ? null : (
          <div className={css.stickyCol}>
            <div className={css.stickyInner}>
              <div className={css.stickyGlow} aria-hidden />
              <motion.div className={css.phoneStage} style={{ rotateY: phoneTilt }}>
                <LandingPhone>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={activeVariant}
                      className={css.phoneScreen}
                      initial={{ opacity: 0, y: reduced ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduced ? 0 : -6 }}
                      transition={landingScreenSwap}
                    >
                      <LandingDemo variant={activeVariant} />
                    </motion.div>
                  </AnimatePresence>
                </LandingPhone>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </LandingSection>
  );
}
