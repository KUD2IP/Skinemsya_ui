import { useRef } from 'react';
import { PencilSimple, Users } from '@phosphor-icons/react';
import type { PositionResponse } from '@/shared/api';
import { formatMoney, haptics, positionUnitPriceKopecks } from '@/shared/lib';
import { Badge, Button, Icon } from '@/shared/ui';
import * as css from './EventPositionsScreen.css';

interface PositionCardProps {
  position: PositionResponse;
  onMarkShared: (id: number) => void;
  markingShared?: boolean;
  onEdit?: (position: PositionResponse) => void;
  onDelete?: (id: number) => void;
  deleting?: boolean;
}

export function PositionCard({
  position,
  onMarkShared,
  markingShared,
  onEdit,
  onDelete,
  deleting,
}: PositionCardProps) {
  const unitPrice =
    position.quantity > 1 ? positionUnitPriceKopecks(position) : null;

  return (
    <article className={css.card}>
      <div className={css.header}>
        <div>
          <div className={css.name}>{position.name}</div>
          <div className={css.meta}>
            {position.quantity} шт.
            {unitPrice != null ? ` · ${formatMoney(unitPrice)}/шт` : null}
          </div>
        </div>
        <span className={css.price}>{formatMoney(position.totalPriceKopecks)}</span>
      </div>

      {position.lowConfidence ? (
        <div className={css.lowConfidenceRow}>
          <p className={css.lowConfidence}>Проверьте цену и название вручную</p>
          {onEdit ? (
            <Button type="button" variant="secondary" size="sm" onClick={() => onEdit(position)}>
              Исправить
            </Button>
          ) : null}
        </div>
      ) : null}

      {position.shared ? (
        <span className={css.sharedBadge}>На всех</span>
      ) : (
        <div className={css.actions}>
          {onEdit ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              leftIcon={<Icon icon={PencilSimple} size="sm" />}
              onClick={() => onEdit(position)}
            >
              Изменить
            </Button>
          ) : null}
          <Button
            type="button"
            variant="secondary"
            size="sm"
            leftIcon={<Icon icon={Users} size="sm" />}
            loading={markingShared}
            onClick={() => onMarkShared(position.id)}
          >
            На всех
          </Button>
          {onDelete ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={deleting}
              onClick={() => onDelete(position.id)}
            >
              Удалить
            </Button>
          ) : null}
        </div>
      )}

      {position.tips ? <Badge tone="warning">Чаевые</Badge> : null}
    </article>
  );
}

interface ReceiptUploadButtonProps {
  onFileSelected: (file: File) => void;
  loading?: boolean;
}

export function ReceiptUploadButton({ onFileSelected, loading }: ReceiptUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      haptics.tap();
      onFileSelected(file);
    }
    e.target.value = '';
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className={css.hiddenInput}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="secondary"
        loading={loading}
        onClick={() => inputRef.current?.click()}
      >
        Загрузить чек
      </Button>
    </>
  );
}

interface AddManualButtonProps {
  onClick: () => void;
}

export function AddManualButton({ onClick }: AddManualButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      onClick={() => {
        haptics.tap();
        onClick();
      }}
    >
      Добавить вручную
    </Button>
  );
}
