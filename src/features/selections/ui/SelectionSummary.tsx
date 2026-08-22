import { Button, Stack } from '@/shared/ui';
import { formatMoney } from '@/shared/lib';
import type { SelectionSummaryItem } from '../model/selectionSummary';
import * as css from './SelectionSummary.css';

interface SelectionSummaryProps {
  items: SelectionSummaryItem[];
  title?: string;
  onEdit?: () => void;
  editing?: boolean;
  variant?: 'card' | 'plain';
}

export function SelectionSummary({
  items,
  title,
  onEdit,
  editing,
  variant = 'card',
}: SelectionSummaryProps) {
  if (!items.length) return null;

  return (
    <div className={variant === 'plain' ? css.plain : css.card}>
      {title || onEdit ? (
        <div className={css.header}>
          {title ? <span className={css.title}>{title}</span> : <span />}
          {onEdit ? (
            <Button type="button" size="sm" variant="secondary" loading={editing} onClick={onEdit}>
              Изменить
            </Button>
          ) : null}
        </div>
      ) : null}
      <Stack gap={3}>
        {items.map((item) => (
          <div key={item.positionId} className={css.row}>
            <Stack gap={1} flex={1}>
              <span className={css.name}>{item.name}</span>
              <span className={css.meta}>{item.shared ? 'На всех' : `${item.quantity} шт`}</span>
            </Stack>
            <span className={css.amount}>{formatMoney(item.amountKopecks)}</span>
          </div>
        ))}
      </Stack>
    </div>
  );
}
