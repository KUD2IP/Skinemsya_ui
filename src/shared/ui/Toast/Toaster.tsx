import { CheckCircle, Info, WarningCircle, XCircle } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '@/shared/ui/Icon';
import { useToastStore, type ToastItem } from './toast.store';
import * as css from './Toast.css';
import { cx, microTween, overlayFade, overlayTween } from '@/shared/lib';

const toneIcons = {
  success: CheckCircle,
  warning: WarningCircle,
  danger: XCircle,
  neutral: Info,
} as const;

function ToastRow({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, item.duration);
    return () => clearTimeout(timer);
  }, [item.revision, item.duration, onDismiss]);

  const ToneIcon = toneIcons[item.tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1, transition: overlayTween }}
      exit={{ opacity: 0, y: -6, scale: 0.97, transition: overlayFade }}
      className={cx(css.toastBase, css.tone[item.tone])}
      role="status"
      onClick={onDismiss}
    >
      <motion.span
        className={css.toastInner}
        key={item.revision}
        initial={{ opacity: 0.75, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={microTween}
      >
        <Icon icon={ToneIcon} size="sm" className={css.toastIcon} />
        <span className={css.toastMessage}>{item.message}</span>
      </motion.span>
    </motion.div>
  );
}

export function Toaster() {
  const toast = useToastStore((s) => s.toast);
  const dismiss = useToastStore((s) => s.dismiss);

  return (
    <div className={css.viewport}>
      <AnimatePresence initial={false}>
        {toast ? <ToastRow key={toast.id} item={toast} onDismiss={dismiss} /> : null}
      </AnimatePresence>
    </div>
  );
}
