import { scrollElementIntoContainer } from './scrollElementIntoContainer';

const INSET_VAR = '--keyboard-inset';
const SETTLE_MS = 140;
/** Меньше этого — дрожание chrome, не клавиатура. */
const MIN_INSET = 80;

const EDITABLE_INPUT_SKIP = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
]);

/**
 * Насколько `position: fixed; bottom: 0` уехал ниже видимой области.
 * На iOS низ и так совпадает с клавиатурой — тогда отступ 0 и шторка не уезжает вверх.
 * Когда клавиатура ложится поверх, отступ равен только перекрытию.
 */
export function readKeyboardInset(): number {
  const viewport = window.visualViewport;
  if (!viewport) return 0;

  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;left:0;bottom:0;width:0;height:0;pointer-events:none;visibility:hidden';
  document.body.appendChild(probe);
  const fixedBottom = probe.getBoundingClientRect().bottom;
  probe.remove();

  const visibleBottom = viewport.offsetTop + viewport.height;
  const overlap = Math.round(fixedBottom - visibleBottom);
  if (overlap < MIN_INSET) return 0;
  return Math.min(overlap, Math.round(window.innerHeight * 0.7));
}

function isEditableField(element: HTMLElement): boolean {
  if (element instanceof HTMLTextAreaElement) return !element.readOnly && !element.disabled;
  if (element instanceof HTMLInputElement) {
    return !EDITABLE_INPUT_SKIP.has(element.type) && !element.readOnly && !element.disabled;
  }
  if (element instanceof HTMLSelectElement) return !element.disabled;
  return element.isContentEditable;
}

function findScrollContainer(element: HTMLElement): HTMLElement | null {
  const sheetBody = element.closest('[data-sheet-body]');
  if (sheetBody instanceof HTMLElement) return sheetBody;

  let node = element.parentElement;
  while (node && node !== document.body && node !== document.documentElement) {
    const { overflowY } = getComputedStyle(node);
    if (overflowY === 'auto' || overflowY === 'scroll') return node;
    node = node.parentElement;
  }
  return null;
}

/** Доскролливает поле внутри своего контейнера, не трогая window. */
export function scrollFieldIntoView(element: HTMLElement): void {
  const container = findScrollContainer(element);
  if (!container) return;

  const viewport = window.visualViewport;
  const visibleBottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
  scrollElementIntoContainer(element, container, 24, visibleBottom);
}

function pinWindowScroll(): void {
  if (window.scrollY !== 0 || document.documentElement.scrollTop !== 0) {
    window.scrollTo(0, 0);
  }
}

/**
 * Клавиатура не ресайзит дерево React.
 * `--keyboard-inset` пишется один раз, когда visualViewport перестал меняться,
 * и тогда же поле один раз доскролливается.
 */
export function bindKeyboardInset(): () => void {
  let applied = '';
  let timer = 0;
  let frame = 0;

  const commit = () => {
    timer = 0;
    pinWindowScroll();

    const next = `${readKeyboardInset()}px`;
    if (next !== applied) {
      applied = next;
      document.documentElement.style.setProperty(INSET_VAR, next);
    }

    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        frame = 0;
        const active = document.activeElement;
        if (active instanceof HTMLElement && isEditableField(active)) {
          scrollFieldIntoView(active);
        }
      });
    });
  };

  const scheduleSettle = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(commit, SETTLE_MS);
  };

  const onViewportScroll = () => {
    pinWindowScroll();
  };

  const onFocusIn = (event: FocusEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !isEditableField(target)) return;
    scheduleSettle();
  };

  const viewport = window.visualViewport;
  viewport?.addEventListener('resize', scheduleSettle);
  viewport?.addEventListener('scroll', onViewportScroll);
  window.addEventListener('orientationchange', scheduleSettle);
  document.addEventListener('focusin', onFocusIn);

  return () => {
    window.clearTimeout(timer);
    if (frame) cancelAnimationFrame(frame);
    viewport?.removeEventListener('resize', scheduleSettle);
    viewport?.removeEventListener('scroll', onViewportScroll);
    window.removeEventListener('orientationchange', scheduleSettle);
    document.removeEventListener('focusin', onFocusIn);
    document.documentElement.style.removeProperty(INSET_VAR);
  };
}
