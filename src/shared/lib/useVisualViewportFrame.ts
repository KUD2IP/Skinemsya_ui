import { useEffect, useState } from 'react';

export interface VisualViewportFrame {
  top: number;
  left: number;
  width: number;
  height: number;
}

const FALLBACK_FRAME: VisualViewportFrame = {
  top: 0,
  left: 0,
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
};

function readFrame(): VisualViewportFrame {
  const viewport = window.visualViewport;
  if (!viewport) return FALLBACK_FRAME;

  const innerHeight = window.innerHeight;
  const innerWidth = window.innerWidth;
  const maxKeyboardInset = Math.round(innerHeight * 0.7);

  const rawHeight = Math.min(viewport.height, innerHeight);
  const keyboardInset = Math.max(0, innerHeight - viewport.height - viewport.offsetTop);
  const clampedInset = Math.min(keyboardInset, maxKeyboardInset);
  const height = Math.max(0, innerHeight - clampedInset);

  return {
    top: Math.max(0, viewport.offsetTop),
    left: Math.max(0, viewport.offsetLeft),
    width: Math.min(viewport.width, innerWidth),
    height: Math.min(rawHeight, height),
  };
}

/** Видимая область visualViewport — для привязки overlay к зоне над клавиатурой. */
export function useVisualViewportFrame(enabled: boolean): VisualViewportFrame {
  const [frame, setFrame] = useState<VisualViewportFrame>(FALLBACK_FRAME);

  useEffect(() => {
    if (!enabled) return;

    const viewport = window.visualViewport;
    let raf = 0;

    const commit = () => {
      raf = 0;
      setFrame(readFrame());
    };

    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(commit);
    };

    commit();
    viewport?.addEventListener('resize', schedule);
    viewport?.addEventListener('scroll', schedule);
    window.addEventListener('orientationchange', schedule);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      viewport?.removeEventListener('resize', schedule);
      viewport?.removeEventListener('scroll', schedule);
      window.removeEventListener('orientationchange', schedule);
    };
  }, [enabled]);

  return frame;
}
