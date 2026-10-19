import { useState } from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react';
import { useEventDebtsQuery } from '@/features/debts/api/queries';
import { isApiError } from '@/shared/api';
import type { EventResponse } from '@/shared/api';
import { haptics } from '@/shared/lib';
import { Button, Icon, Sheet, Stack, toast } from '@/shared/ui';
import { useRevertToDraft } from '../api/queries';
import { canRevertToDraft } from '../model/eventRoster';
import * as css from './RevertToDraftControl.css';

interface RevertToDraftControlProps {
  groupId: number;
  event: EventResponse;
  currentUserId?: number;
}

export function RevertToDraftControl({
  groupId,
  event,
  currentUserId,
}: RevertToDraftControlProps) {
  const revert = useRevertToDraft(event.id, groupId);
  const canRevert = canRevertToDraft(event, currentUserId);
  const { data: debts, isLoading: debtsLoading, isError: debtsError } = useEventDebtsQuery(
    event.id,
    canRevert,
  );
  const [confirm, setConfirm] = useState(false);
  const transferMarked = (debts ?? []).some(
    (debt) => debt.status === 'PENDING_CONFIRMATION' || debt.status === 'PAID',
  );

  if (!canRevert || (debtsLoading && !debtsError)) {
    return null;
  }

  if (transferMarked) {
    return <p className={css.lockedNote}>Сбор уже нельзя изменить: кто-то уже скинул.</p>;
  }

  const handleRevert = async () => {
    try {
      await revert.mutateAsync();
      haptics.success();
      toast.success('Сбор снова в подготовке');
      setConfirm(false);
    } catch (error) {
      haptics.error();
      const locked =
        isApiError(error) &&
        (error.message.toLowerCase().includes('payment') ||
          error.message.toLowerCase().includes('draft only before'));
      toast.error(
        locked
          ? 'Вернуть нельзя: кто-то уже отметил перевод'
          : isApiError(error)
            ? error.message
            : 'Не удалось вернуть сбор в подготовку',
      );
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        leftIcon={<Icon icon={ArrowCounterClockwise} size="sm" />}
        onClick={() => {
          haptics.tap();
          setConfirm(true);
        }}
      >
        Вернуть в подготовку
      </Button>
      <Sheet
        open={confirm}
        onOpenChange={setConfirm}
        title="Вернуть в подготовку?"
        description="Выборы участников сбросятся, неоплаченные суммы исчезнут. Позиции останутся — их можно поправить и запустить сбор снова."
      >
        <Stack gap={3}>
          <Button
            type="button"
            fullWidth
            loading={revert.isPending}
            onClick={() => void handleRevert()}
          >
            Вернуть и поправить
          </Button>
          <Button type="button" variant="secondary" fullWidth onClick={() => setConfirm(false)}>
            Отмена
          </Button>
        </Stack>
      </Sheet>
    </>
  );
}
