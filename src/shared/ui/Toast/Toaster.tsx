import { CheckCircle, Info, WarningCircle, XCircle } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Icon } from '@/shared/ui/Icon';
import { useToastStore, type ToastItem } from './toast.store';
import * as css from './Toast.css';
import { cx, overlayFade } from '@/shared/lib';

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: overlayFade }}
      exit={{ opacity: 0, transition: overlayFade }}
      className={cx(css.toastBase, css.tone[item.tone])}
      role="status"
      onClick={onDismiss}
    >
      <span className={css.toastInner}>
        <Icon icon={ToneIcon} size="sm" className={css.toastIcon} />
        <span className={css.toastMessage}>{item.message}</span>
      </span>
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
