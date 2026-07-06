import { useRef, type ReactNode } from 'react';
import { PencilSimple, Users } from '@phosphor-icons/react';
import type { PositionResponse } from '@/shared/api';
import { formatMoney, haptics, positionUnitPriceKopecks } from '@/shared/lib';
import { Badge, Button, Icon } from '@/shared/ui';
import * as css from './EventPositionsScreen.css';

interface PositionCardProps {
  position: PositionResponse;
  onMarkShared: (id: number) => void;
  markingShared?: boolean;
  onUnmarkShared?: (id: number) => void;
  unmarkingShared?: boolean;
  onEdit?: (position: PositionResponse) => void;
  onDelete?: (id: number) => void;
  deleting?: boolean;
}

function ActionButton({
  children,
  loading,
  onClick,
  leftIcon,
}: {
  children: ReactNode;
  loading?: boolean;
  onClick: () => void;
  leftIcon?: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      fullWidth
      className={css.actionButton}
      loading={loading}
      leftIcon={leftIcon}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

export function PositionCard({
  position,
  onMarkShared,
  markingShared,
  onUnmarkShared,
  unmarkingShared,
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
            {position.shared ? ' · На всех' : null}
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

      <div className={css.actions}>
        {onEdit ? (
          <ActionButton
            leftIcon={<Icon icon={PencilSimple} size="md" />}
            onClick={() => onEdit(position)}
          >
            Изменить
          </ActionButton>
        ) : (
          <span />
        )}
        {position.shared && onUnmarkShared ? (
          <ActionButton loading={unmarkingShared} onClick={() => onUnmarkShared(position.id)}>
            Не на всех
          </ActionButton>
        ) : (
          <ActionButton
            leftIcon={<Icon icon={Users} size="sm" />}
            loading={markingShared}
            onClick={() => onMarkShared(position.id)}
          >
            На всех
          </ActionButton>
        )}
        {onDelete ? (
          <ActionButton loading={deleting} onClick={() => onDelete(position.id)}>
            Удалить
          </ActionButton>
        ) : (
          <span />
        )}
      </div>

      {position.tips ? (
        <Badge tone="warning" className={css.tipsBadge}>
          Чаевые
        </Badge>
      ) : null}
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
