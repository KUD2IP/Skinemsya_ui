import { ArrowClockwise } from '@phosphor-icons/react';
import { motion } from 'motion/react';
import { Icon } from '@/shared/ui/Icon';
import { IconButton } from '@/shared/ui/IconButton';
import { usePrefersReducedMotion } from '@/shared/lib';

export interface RefreshIconButtonProps {
  refreshing: boolean;
  onRefresh: () => void;
}

/** Кнопка обновления с вращающейся иконкой во время refetch. */
export function RefreshIconButton({ refreshing, onRefresh }: RefreshIconButtonProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <IconButton
      aria-label={refreshing ? 'Обновление…' : 'Обновить'}
      aria-busy={refreshing}
      disabled={refreshing}
      onClick={() => onRefresh()}
    >
      <motion.span
        style={{ display: 'flex' }}
        animate={refreshing && !reduced ? { rotate: 360 } : { rotate: 0 }}
        transition={
          refreshing && !reduced
            ? { repeat: Infinity, duration: 0.7, ease: 'linear' }
            : { duration: 0.25, ease: 'easeOut' }
        }
      >
        <Icon icon={ArrowClockwise} />
      </motion.span>
    </IconButton>
  );
}
