import { useEffect, useState } from 'react';

export interface VisualViewportLayout {
  /** Высота перекрытия layout viewport виртуальной клавиатурой. */
  keyboardInset: number;
  /** Смещение visual viewport от верха (iOS / Telegram при клавиатуре). */
  offsetTop: number;
  /** Видимая высота visual viewport. */
  visibleHeight: number;
}

function readLayout(): VisualViewportLayout {
  const layoutHeight = window.innerHeight;
  const viewport = window.visualViewport;

  if (!viewport) {
    return {
      keyboardInset: 0,
      offsetTop: 0,
      visibleHeight: layoutHeight,
    };
  }

  const keyboardInset = Math.max(
    0,
    Math.round(layoutHeight - viewport.height - viewport.offsetTop),
  );

  return {
    keyboardInset,
    offsetTop: Math.round(viewport.offsetTop),
    visibleHeight: Math.round(viewport.height),
  };
}

const initialLayout =
  typeof window !== 'undefined' ? readLayout() : { keyboardInset: 0, offsetTop: 0, visibleHeight: 0 };

/** Геометрия visual viewport с батчингом через rAF — меньше лагов при открытии клавиатуры. */
export function useVisualViewportLayout(): VisualViewportLayout {
  const [layout, setLayout] = useState<VisualViewportLayout>(initialLayout);

  useEffect(() => {
    let raf = 0;

    const commit = () => {
      setLayout(readLayout());
    };

    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(commit);
    };

    schedule();

    const viewport = window.visualViewport;
    viewport?.addEventListener('resize', schedule);
    viewport?.addEventListener('scroll', schedule);
    window.addEventListener('orientationchange', schedule);

    return () => {
      cancelAnimationFrame(raf);
      viewport?.removeEventListener('resize', schedule);
      viewport?.removeEventListener('scroll', schedule);
      window.removeEventListener('orientationchange', schedule);
    };
  }, []);

  return layout;
}
