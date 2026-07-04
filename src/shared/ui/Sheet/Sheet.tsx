import { Portal } from '@ark-ui/react/portal';
import {
  animate,
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  type PanInfo,
} from 'motion/react';
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import {
  cx,
  sheetBackdrop,
  sheetDragSnap,
  sheetPanel,
  usePrefersReducedMotion,
  useTransientWillChange,
  useVisualViewportLayout,
} from '@/shared/lib';
import * as css from './Sheet.css';
import { useOverlayStore } from './sheet.store';

const DISMISS_OFFSET = 88;
const DISMISS_VELOCITY = 380;
const WILL_CHANGE_MS = 420;

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Вызывается после завершения exit-анимации (для reset формы). */
  onClosed?: () => void;
  title?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  /** Поверх другой шторки (например, выбор плательщика). */
  nested?: boolean;
}

/** Нижняя шторка с плавной анимацией и свайпом вниз для закрытия. */
export function Sheet({
  open,
  onOpenChange,
  onClosed,
  title,
  description,
  children,
  nested,
}: SheetProps) {
  const titleId = useId();
  const descId = useId();
  const reduced = usePrefersReducedMotion();
  const { keyboardInset, offsetTop, visibleHeight } = useVisualViewportLayout();
  const dragY = useMotionValue(0);
  const dragControls = useDragControls();
  const wasOpen = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const exitSlideOffset = useRef<number | string>('100%');
  const [panelHeight, setPanelHeight] = useState(0);
  const [animating, setAnimating] = useState(false);
  const registerSheet = useOverlayStore((s) => s.registerSheet);
  const unregisterSheet = useOverlayStore((s) => s.unregisterSheet);
  const layer = nested ? 'nested' : 'base';

  useTransientWillChange(panelRef, open ? 'open' : 'closed', WILL_CHANGE_MS);

  useLayoutEffect(() => {
    if (!open) return;
    const node = panelRef.current;
    if (!node) return;

    const measure = () => {
      const height = node.offsetHeight;
      if (height > 0) {
        setPanelHeight(height);
        exitSlideOffset.current = height;
      }
    };

    measure();
    const frame = requestAnimationFrame(measure);

    const observer = new ResizeObserver(measure);
    observer.observe(node);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [open, title, description]);

  useEffect(() => {
    if (!open) return;
    registerSheet();
    return unregisterSheet;
  }, [open, registerSheet, unregisterSheet]);

  useEffect(() => {
    if (!open) return;
    dragY.set(0);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onOpenChange, dragY]);

  useEffect(() => {
    if (!open) return;
    const body = bodyRef.current;
    if (!body) return;

    const scrollFocusedField = (target: HTMLElement) => {
      const padding = 20;
      const bodyRect = body.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      if (targetRect.bottom > bodyRect.bottom - padding) {
        body.scrollTop += targetRect.bottom - bodyRect.bottom + padding;
      } else if (targetRect.top < bodyRect.top + padding) {
        body.scrollTop -= bodyRect.top + padding - targetRect.top;
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches('input, textarea, select, [contenteditable="true"]')) return;

      requestAnimationFrame(() => scrollFocusedField(target));
      window.setTimeout(() => scrollFocusedField(target), 320);
    };

    body.addEventListener('focusin', onFocusIn);
    return () => body.removeEventListener('focusin', onFocusIn);
  }, [open]);

  const close = () => onOpenChange(false);

  const onDragEnd = (_event: PointerEvent, info: PanInfo) => {
    if (info.offset.y > DISMISS_OFFSET || info.velocity.y > DISMISS_VELOCITY) {
      close();
      return;
    }
    void animate(dragY, 0, sheetDragSnap);
  };

  const handleExitComplete = () => {
    dragY.set(0);
    setAnimating(false);
    if (wasOpen.current) {
      wasOpen.current = false;
      onClosed?.();
    }
  };

  if (open) wasOpen.current = true;

  const panelTransition = reduced ? { duration: 0 } : sheetPanel;
  const backdropTransition = reduced ? { duration: 0 } : sheetBackdrop;
  const slideOffset = panelHeight > 0 ? panelHeight : exitSlideOffset.current;
  const keyboardOpen = keyboardInset > 48;

  return (
    <AnimatePresence initial={false} mode="sync" onExitComplete={handleExitComplete}>
      {open ? (
        <Portal key="sheet-portal">
          <motion.button
            type="button"
            aria-label="Закрыть"
            className={css.backdrop({ layer })}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: 'none' }}
            transition={backdropTransition}
            onClick={() => {
              if (keyboardOpen) return;
              close();
            }}
          />

          <div
            className={cx(css.positioner({ layer }), keyboardOpen && css.positionerKeyboard)}
            style={
              keyboardOpen
                ? ({
                    top: offsetTop,
                    height: visibleHeight,
                    bottom: 'auto',
                  } as CSSProperties)
                : undefined
            }
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title != null ? titleId : undefined}
              aria-describedby={description != null ? descId : undefined}
              className={cx(css.content, animating && css.contentAnimating)}
              style={
                keyboardOpen
                  ? ({
                      maxHeight: `min(92%, ${visibleHeight - 16}px)`,
                      '--sheet-keyboard-inset': `${keyboardInset}px`,
                    } as CSSProperties)
                  : undefined
              }
              initial={{ y: slideOffset }}
              animate={{ y: 0 }}
              exit={{ y: slideOffset }}
              transition={panelTransition}
              onAnimationStart={() => setAnimating(true)}
              onAnimationComplete={() => setAnimating(false)}
            >
              <motion.div
                style={{ y: dragY }}
                drag={reduced || keyboardOpen ? false : 'y'}
                dragControls={dragControls}
                dragListener={false}
                dragConstraints={{ top: 0 }}
                dragElastic={{ top: 0, bottom: 0.65 }}
                onDragEnd={onDragEnd}
              >
                <div
                  className={css.grabberRow}
                  onPointerDown={(event) => {
                    if (reduced) return;
                    dragControls.start(event);
                  }}
                >
                  <div className={css.grabber} aria-hidden />
                </div>

                {title != null || description != null ? (
                  <div className={css.header}>
                    {title != null ? (
                      <h2 id={titleId} className={css.titleText}>
                        {title}
                      </h2>
                    ) : null}
                    {description != null ? (
                      <p id={descId} className={css.descriptionText}>
                        {description}
                      </p>
                    ) : null}
                  </div>
                ) : null}

                <div ref={bodyRef} className={css.body}>
                  {children}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </Portal>
      ) : null}
    </AnimatePresence>
  );
}

export { useAnySheetOpen } from './sheet.store';
