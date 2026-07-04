import type { Variants } from 'motion/react';

const easeExit = [0.4, 0, 0.2, 1] as const;

/** Плавное замедление для overlay/tab в WebView — без overshoot. */
export const easeOutOverlay = [0.32, 0.72, 0, 1] as const;

/** Slide-up шторки и крупных overlay. */
export const overlayTween = {
  type: 'tween',
  duration: 0.36,
  ease: easeOutOverlay,
} as const;

/** Fade backdrop под шторкой. */
export const overlayFade = {
  duration: 0.28,
  ease: easeOutOverlay,
} as const;

/** Горизонтальный pager вкладок (Motion fallback; предпочтительно CSS transition). */
export const tabSlide = {
  type: 'tween',
  duration: 0.32,
  ease: easeOutOverlay,
} as const;

/** Микро-анимации: иконки табов, toast content. */
export const microTween = {
  duration: 0.18,
  ease: easeOutOverlay,
} as const;

/** Затухание splash при старте / обновлении страницы. */
export const splashScreen: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 1 },
  exit: {
    opacity: 0,
    scale: 1.03,
    filter: 'blur(10px)',
    transition: { duration: 0.55, ease: easeExit },
  },
};

/** Появление приложения после splash. */
export const appReveal: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 280, damping: 32, mass: 0.9, delay: 0.08 },
  },
};

/** @deprecated Tab routes use TabPagerLayout horizontal track; kept for reference. */
export const tabSwitch: Variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: direction === 0 ? '6%' : `${direction * 32}%`,
    scale: 0.98,
  }),
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 30, mass: 0.9 },
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction === 0 ? '-6%' : `${direction * -22}%`,
    scale: 0.985,
    transition: { type: 'spring', stiffness: 300, damping: 34, mass: 0.85 },
  }),
};

/** Push / pop стеков экранов (список → детали → назад). Без translate — стабильный hit-testing в WebView. */
export const stackSwitch: Variants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    pointerEvents: 'none',
  },
  animate: {
    opacity: 1,
    scale: 1,
    pointerEvents: 'auto',
    transition: { type: 'spring', stiffness: 340, damping: 34, mass: 0.82 },
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    pointerEvents: 'none',
    transition: { duration: 0.22, ease: easeExit },
  },
};

/** @deprecated Используйте appReveal */
export const appEnter: Variants = appReveal;

/** Мягкое появление контента экрана — без резкого скачка. */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 6 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.32, ease: easeOutOverlay },
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: { duration: 0.24, ease: easeExit },
  },
};

export const fade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: overlayFade },
  exit: { opacity: 0, transition: overlayFade },
};

export const staggerContainer = (stagger = 0.04): Variants => ({
  initial: {},
  animate: { transition: { staggerChildren: stagger, delayChildren: 0.04 } },
});

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 4 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: easeOutOverlay },
  },
};

export const pressable = {
  whileTap: { scale: 0.98 },
  transition: microTween,
} as const;

/** Затемнение под шторкой — tween, без пружины. */
export const sheetBackdrop = overlayFade;

/** Панель шторки — tween без overshoot. */
export const sheetPanel = overlayTween;

/** Возврат панели после drag. */
export const sheetDragSnap = {
  type: 'tween',
  duration: 0.24,
  ease: easeOutOverlay,
} as const;

export const spring = {
  soft: { type: 'spring', stiffness: 260, damping: 30, mass: 0.9 },
  snappy: { type: 'spring', stiffness: 420, damping: 32 },
  bouncy: { type: 'spring', stiffness: 500, damping: 24 },
  /** @deprecated Используйте sheetPanel */
  sheet: { type: 'spring', stiffness: 280, damping: 38, mass: 0.9 },
  tab: { type: 'spring', stiffness: 380, damping: 36, mass: 0.75 },
  /** @deprecated TabPagerLayout использует CSS transition + tabSlide */
  tabPager: { type: 'spring', stiffness: 240, damping: 32, mass: 0.95 },
} as const;
