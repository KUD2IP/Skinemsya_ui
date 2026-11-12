const KEYBOARD_DROP = 80;

/** Ближайший предок, у которого есть что прокручивать. Статичный экран сюда не попадает. */
function scrollingAncestor(start: HTMLElement): HTMLElement | null {
  let node: HTMLElement | null = start;
  while (node && node !== document.body && node !== document.documentElement) {
    const { overflowY } = getComputedStyle(node);
    const scrollable = overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay';
    if (scrollable && node.scrollHeight > node.clientHeight + 1) return node;
    node = node.parentElement;
  }
  return null;
}

function fieldFocused(): boolean {
  const active = document.activeElement;
  return (
    active instanceof HTMLInputElement ||
    active instanceof HTMLTextAreaElement ||
    (active instanceof HTMLElement && active.isContentEditable)
  );
}

/**
 * Держит высоту кадра на полном экране, когда появляется клавиатура,
 * и не даёт случайному свайпу сдвинуть статичную страницу.
 * Прокручиваемый список у края не обрывается: жест остаётся у него.
 */
export function lockAppFrame(): () => void {
  const root = document.documentElement;
  let locked = 0;
  let startY = 0;

  const applyHeight = (next: number) => {
    locked = next;
    root.style.setProperty('--app-locked-height', `${next}px`);
  };

  const measure = () => {
    const viewport = window.visualViewport;
    const next = Math.round(viewport?.height ?? window.innerHeight);
    if (next <= 0) return;
    if (locked === 0 || next > locked) {
      applyHeight(next);
      return;
    }
    if (fieldFocused() && locked - next >= KEYBOARD_DROP) return;
    applyHeight(next);
  };

  const onTouchStart = (event: TouchEvent) => {
    startY = event.touches[0]?.clientY ?? 0;
  };

  const onTouchMove = (event: TouchEvent) => {
    if (event.touches.length !== 1) return;
    const y = event.touches[0]?.clientY ?? startY;
    const delta = y - startY;
    if (Math.abs(delta) < 8) return;
    const target = event.target;
    if (!(target instanceof HTMLElement) || !scrollingAncestor(target)) {
      event.preventDefault();
    }
  };

  const pinScroll = () => {
    if (window.scrollY !== 0 || root.scrollTop !== 0) window.scrollTo(0, 0);
  };

  measure();
  const viewport = window.visualViewport;
  viewport?.addEventListener('resize', measure);
  viewport?.addEventListener('scroll', pinScroll);
  window.addEventListener('orientationchange', () => {
    locked = 0;
    measure();
  });
  window.addEventListener('scroll', pinScroll, { passive: true });
  document.addEventListener('touchstart', onTouchStart, { passive: true });
  document.addEventListener('touchmove', onTouchMove, { passive: false });

  return () => {
    viewport?.removeEventListener('resize', measure);
    viewport?.removeEventListener('scroll', pinScroll);
    window.removeEventListener('scroll', pinScroll);
    document.removeEventListener('touchstart', onTouchStart);
    document.removeEventListener('touchmove', onTouchMove);
    root.style.removeProperty('--app-locked-height');
  };
}
