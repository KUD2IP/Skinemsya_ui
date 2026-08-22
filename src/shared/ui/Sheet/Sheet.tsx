import { Portal } from '@ark-ui/react/portal';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { X } from '@phosphor-icons/react';
import {
  cx,
  sheetBackdrop,
  sheetPanel,
  scrollElementIntoContainer,
  useBodyScrollLock,
  usePrefersReducedMotion,
  useTransientWillChange,
  useVisualViewportFrame,
} from '@/shared/lib';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import * as css from './Sheet.css';
import { useOverlayStore } from './sheet.store';

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

function setTelegramVerticalSwipes(enabled: boolean) {
  const webApp = (
    window as Window & {
      Telegram?: { WebApp?: { enableVerticalSwipes?: () => void; disableVerticalSwipes?: () => void } };
    }
  ).Telegram?.WebApp;
  if (!webApp) return;
  if (enabled) {
    webApp.enableVerticalSwipes?.();
    return;
  }
  webApp.disableVerticalSwipes?.();
}

/** Нижняя шторка: закрытие крестиком, без свайпа вниз. */
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
  const viewportFrame = useVisualViewportFrame(open);
  useBodyScrollLock(open);
  const wasOpen = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [panelHeight, setPanelHeight] = useState(0);
  const [animating, setAnimating] = useState(false);
  const registerSheet = useOverlayStore((s) => s.registerSheet);
  const unregisterSheet = useOverlayStore((s) => s.unregisterSheet);
  const layer = nested ? 'nested' : 'base';

  useTransientWillChange(panelRef, open ? 'open' : 'closed', WILL_CHANGE_MS);

  useLayoutEffect(() => {
    if (!open) {
      setPanelHeight(0);
      return;
    }
    const node = panelRef.current;
    if (!node) return;

    const height = node.offsetHeight;
    if (height > 0) setPanelHeight(height);
  }, [open, title, description]);

  useEffect(() => {
    if (!open) return;
    registerSheet();
    setTelegramVerticalSwipes(false);
    return () => {
      unregisterSheet();
      if (useOverlayStore.getState().sheetCount === 0) {
        setTelegramVerticalSwipes(true);
      }
    };
  }, [open, registerSheet, unregisterSheet]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const body = bodyRef.current;
    if (!body) return;

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (!target.matches('input, textarea, select, [contenteditable="true"]')) return;
      requestAnimationFrame(() => scrollElementIntoContainer(target, body));
    };

    body.addEventListener('focusin', onFocusIn);
    return () => body.removeEventListener('focusin', onFocusIn);
  }, [open]);

  const close = () => onOpenChange(false);

  const handleExitComplete = () => {
    setAnimating(false);
    if (wasOpen.current) {
      wasOpen.current = false;
      onClosed?.();
    }
  };

  const handleAnimationComplete = () => {
    setAnimating(false);
    const node = panelRef.current;
    if (node && node.offsetHeight > 0) {
      setPanelHeight(node.offsetHeight);
    }
  };

  if (open) wasOpen.current = true;

  const panelTransition = reduced ? { duration: 0 } : sheetPanel;
  const backdropTransition = reduced ? { duration: 0 } : sheetBackdrop;
  const slideOffset = panelHeight > 0 ? panelHeight : '100%';

  const positionerStyle: CSSProperties = {
    top: viewportFrame.top,
    left: viewportFrame.left,
    width: viewportFrame.width,
    height: viewportFrame.height,
    right: 'auto',
    bottom: 'auto',
  };

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
            onClick={close}
          />

          <div className={css.positioner({ layer })} style={positionerStyle}>
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title != null ? titleId : undefined}
              aria-describedby={description != null ? descId : undefined}
              className={cx(css.content, animating && css.contentAnimating)}
              initial={{ y: slideOffset }}
              animate={{ y: 0 }}
              exit={{ y: slideOffset }}
              transition={panelTransition}
              onAnimationStart={() => setAnimating(true)}
              onAnimationComplete={handleAnimationComplete}
            >
              <div className={css.panelInner}>
                <div className={css.header}>
                  <div className={css.headerTop}>
                    {title != null ? (
                      <h2 id={titleId} className={css.titleText}>
                        {title}
                      </h2>
                    ) : (
                      <span className={css.titleSpacer} />
                    )}
                    <IconButton
                      aria-label="Закрыть"
                      variant="bare"
                      size="sm"
                      onClick={close}
                    >
                      <Icon icon={X} weight="bold" />
                    </IconButton>
                  </div>
                  {description != null ? (
                    <p id={descId} className={css.descriptionText}>
                      {description}
                    </p>
                  ) : null}
                </div>

                <div ref={bodyRef} className={css.body} data-sheet-body>
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </Portal>
      ) : null}
    </AnimatePresence>
  );
}

export { useAnySheetOpen } from './sheet.store';
