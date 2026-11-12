import { Portal } from '@ark-ui/react/portal';
import { useEffect, useId, useRef, useState, type AnimationEvent, type ReactNode } from 'react';
import { X } from '@phosphor-icons/react';
import { cx, useBodyScrollLock, usePrefersReducedMotion } from '@/shared/lib';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import * as css from './Sheet.css';
import { useOverlayStore } from './sheet.store';

type Phase = 'closed' | 'open' | 'closing';

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Вызывается после завершения закрытия (для reset формы). */
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
  if (enabled) webApp.enableVerticalSwipes?.();
  else webApp.disableVerticalSwipes?.();
}

/** Нижняя шторка. Въезд и выезд — короткий сдвиг, в покое transform снят. */
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
  const onClosedRef = useRef(onClosed);
  const phaseRef = useRef<Phase>('closed');
  const [phase, setPhase] = useState<Phase>('closed');
  const [settled, setSettled] = useState(false);
  const registerSheet = useOverlayStore((s) => s.registerSheet);
  const unregisterSheet = useOverlayStore((s) => s.unregisterSheet);
  const visible = phase !== 'closed';
  const layer = nested ? 'nested' : 'base';

  onClosedRef.current = onClosed;
  useBodyScrollLock(visible);

  useEffect(() => {
    if (open) {
      setSettled(reduced);
      setPhase('open');
      return;
    }
    setSettled(false);
    setPhase((current) => (current === 'closed' ? 'closed' : 'closing'));
  }, [open, reduced]);

  useEffect(() => {
    if (phase !== 'open' || settled) return;
    const timer = window.setTimeout(() => setSettled(true), 280);
    return () => window.clearTimeout(timer);
  }, [phase, settled]);

  useEffect(() => {
    if (phase !== 'closing') return;
    const timer = window.setTimeout(() => setPhase('closed'), reduced ? 0 : 200);
    return () => window.clearTimeout(timer);
  }, [phase, reduced]);

  useEffect(() => {
    const previous = phaseRef.current;
    phaseRef.current = phase;
    if (phase === 'closed' && previous !== 'closed') onClosedRef.current?.();
  }, [phase]);

  useEffect(() => {
    if (!visible) return;
    registerSheet();
    setTelegramVerticalSwipes(false);
    return () => {
      unregisterSheet();
    };
  }, [visible, registerSheet, unregisterSheet]);

  useEffect(() => {
    if (!visible) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onOpenChange(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [visible, onOpenChange]);

  const onPanelAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (phase === 'open' && event.animationName === css.sheetIn) setSettled(true);
    if (phase === 'closing' && event.animationName === css.sheetOut) setPhase('closed');
  };

  if (!visible) return null;

  const panelMotion = phase === 'closing' ? css.panelExit : settled ? undefined : css.panelEnter;

  return (
    <Portal>
      <div className={css.root({ layer })}>
        <button
          type="button"
          aria-label="Закрыть"
          className={cx(css.backdrop, phase === 'open' && !settled && css.backdropEnter)}
          onClick={() => onOpenChange(false)}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={title != null ? titleId : undefined}
          aria-describedby={description != null ? descId : undefined}
          className={cx(css.panel, panelMotion)}
          onAnimationEnd={onPanelAnimationEnd}
        >
          <div className={css.header}>
            <div className={css.headerTop}>
              {title != null ? (
                <h2 id={titleId} className={css.titleText}>
                  {title}
                </h2>
              ) : (
                <span className={css.titleSpacer} />
              )}
              <IconButton aria-label="Закрыть" variant="bare" size="sm" onClick={() => onOpenChange(false)}>
                <Icon icon={X} weight="bold" />
              </IconButton>
            </div>
            {description != null ? (
              <p id={descId} className={css.descriptionText}>
                {description}
              </p>
            ) : null}
          </div>

          <div className={css.body} data-sheet-body>
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export { useAnySheetOpen } from './sheet.store';
