import type { Transition, Variants } from 'motion/react';

export const easeOut = [0.22, 1, 0.36, 1] as const;

/** Сглаживание скролл-привязанных значений на лендинге. */
export const landingScrollSpring = { stiffness: 88, damping: 26, mass: 0.92 } as const;

/** Плавная смена экрана в мокапе телефона. */
export const landingScreenSwap: Transition = {
  duration: 0.52,
  ease: easeOut,
};

/** Приглушение неактивных сцен таймлайна. */
export const landingBeatFade: Transition = {
  duration: 0.55,
  ease: easeOut,
};

/** Появление секции при скролле. */
export const landingReveal: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: easeOut },
  },
};

/** Stagger для дочерних элементов внутри секции. */
export const landingStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.06 },
  },
};

export const landingItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

/** Строка чека: выезжает из-под предыдущей, как из термопринтера. */
export const receiptLine: Variants = {
  hidden: { opacity: 0, y: -6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.24, ease: easeOut },
  },
};

/** Пунктирная выноска дорисовывается слева направо. */
export const receiptLeader: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.32, ease: easeOut } },
};

/** Лента чека печатается построчно. */
export const receiptRoll: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

/** Цифра на табло: въезжает снизу. */
export const rollDigit: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: '0%', opacity: 1, transition: { duration: 0.42, ease: easeOut } },
};
