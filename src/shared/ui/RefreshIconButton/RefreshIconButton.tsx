import { ArrowClockwise } from '@phosphor-icons/react';
import { cx } from '@/shared/lib';
import { Icon } from '@/shared/ui/Icon';
import { IconButton } from '@/shared/ui/IconButton';
import * as css from './RefreshIconButton.css';

export interface RefreshIconButtonProps {
  refreshing: boolean;
  onRefresh: () => void;
}

/** Кнопка обновления с вращающейся иконкой во время refetch. */
export function RefreshIconButton({ refreshing, onRefresh }: RefreshIconButtonProps) {
  return (
    <IconButton
      variant="bare"
      aria-label={refreshing ? 'Обновление…' : 'Обновить'}
      aria-busy={refreshing}
      disabled={refreshing}
      onClick={() => onRefresh()}
    >
      <span className={cx(css.icon, refreshing && css.spinning)}>
        <Icon icon={ArrowClockwise} weight="bold" />
      </span>
    </IconButton>
  );
}
