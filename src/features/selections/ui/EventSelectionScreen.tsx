import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CaretLeft } from '@phosphor-icons/react';
import type { EventResponse, PositionResponse } from '@/shared/api';
import { useEventReceiptsQuery, usePositionsQuery } from '@/features/positions/api/queries';
import { ReceiptPreview } from '@/features/positions/ui/ReceiptPreview';
import { PaymentScreen } from '@/features/payments/ui/PaymentScreen';
import { useParticipantsStatusQuery, useEventDebtsQuery } from '@/features/debts/api/queries';
import { isApiError } from '@/shared/api';
import { eventStatusLabel, formatMoney, haptics, positionUnitPriceKopecks } from '@/shared/lib';
import {
  Button,
  EmptyState,
  Icon,
  IconButton,
  Screen,
  Skeleton,
  Stack,
  toast,
} from '@/shared/ui';
import { useCompleteSelection, useUpdateSelections } from '../api/queries';
import * as css from './EventSelectionScreen.css';

interface EventSelectionScreenProps {
  groupId: number;
  eventId: number;
  event: EventResponse;
  currentUserId?: number;
}

function remainingFor(position: PositionResponse): number {
  if (position.shared) return 0;
  return position.remainingQuantity ?? Math.floor(position.quantity);
}

function sortSelectablePositions(positions: PositionResponse[]): PositionResponse[] {
  return [...positions].sort((a, b) => {
    const aSoldOut = a.soldOut === true;
    const bSoldOut = b.soldOut === true;
    if (aSoldOut === bSoldOut) return 0;
    return aSoldOut ? 1 : -1;
  });
}

export function EventSelectionScreen({
  groupId,
  eventId,
  event,
  currentUserId,
}: EventSelectionScreenProps) {
  const navigate = useNavigate();
  const { data: positions, isLoading, isError, refetch } = usePositionsQuery(eventId, {
    refetchInterval: 3000,
  });
  const { data: receipts } = useEventReceiptsQuery(eventId);
  const { data: participantsStatus } = useParticipantsStatusQuery(eventId);
  const { data: debts, refetch: refetchDebts } = useEventDebtsQuery(eventId);
  const updateSelections = useUpdateSelections(eventId);
  const completeSelection = useCompleteSelection(eventId, groupId);

  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [showPayment, setShowPayment] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const myStatus = participantsStatus?.participants.find((p) => p.userId === currentUserId);
  const selectionDone = myStatus?.selectionCompleted ?? false;

  const myDebt = useMemo(
    () => (debts ?? []).find((d) => d.debtorId === currentUserId),
    [debts, currentUserId],
  );

  useEffect(() => {
    if (!positions?.length) return;
    setQuantities((prev) => {
      const next = { ...prev };
      for (const position of positions) {
        if (position.shared) continue;
        const max = remainingFor(position);
        const fromServer = position.mySelectedQuantity ?? 0;
        const current = prev[position.id];
        if (current == null) {
          next[position.id] = Math.min(fromServer, max);
        } else {
          next[position.id] = Math.min(current, max);
        }
      }
      return next;
    });
  }, [positions]);

  const participantCount = participantsStatus?.totalParticipants ?? 1;

  const nonSharedPositions = useMemo(
    () => sortSelectablePositions((positions ?? []).filter((p) => !p.shared)),
    [positions],
  );

  const totalKopecks = useMemo(() => {
    if (!positions) return 0;
    return positions.reduce((sum, position) => {
      const qty = quantities[position.id] ?? 0;
      if (position.shared) {
        return sum + Math.round(position.totalPriceKopecks / Math.max(participantCount, 1));
      }
      if (qty <= 0) return sum;
      return sum + Math.round(positionUnitPriceKopecks(position) * qty);
    }, 0);
  }, [participantCount, positions, quantities]);

  const hasPayableSelection = useMemo(() => {
    if (!positions?.length) return false;
    const hasNonSharedQty = Object.values(quantities).some((qty) => qty > 0);
    const hasShared = positions.some((p) => p.shared);
    return hasNonSharedQty || hasShared;
  }, [positions, quantities]);

  const adjustQty = (positionId: number, delta: number, max: number) => {
    setQuantities((prev) => {
      const current = prev[positionId] ?? 0;
      const next = Math.min(max, Math.max(0, current + delta));
      return { ...prev, [positionId]: next };
    });
  };

  const buildSelectionsPayload = () =>
    Object.entries(quantities)
      .filter(([, qty]) => qty > 0)
      .map(([positionId, quantity]) => ({
        positionId: Number(positionId),
        quantity,
      }));

  const handlePay = async () => {
    if (!hasPayableSelection) return;
    setSubmitting(true);
    try {
      const selections = buildSelectionsPayload();
      if (selections.length) {
        await updateSelections.mutateAsync({ selections });
      }
      await completeSelection.mutateAsync();
      const { data: updatedDebts } = await refetchDebts();
      const debt = updatedDebts?.find((d) => d.debtorId === currentUserId);
      haptics.success();
      if (debt) {
        setShowPayment(true);
      } else {
        toast.info('Выбор сохранён. Сумма появится, когда можно будет перевести.');
      }
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось сохранить выбор');
      void refetch();
    } finally {
      setSubmitting(false);
    }
  };

  if (showPayment && myDebt) {
    return (
      <PaymentScreen
        groupId={groupId}
        eventId={eventId}
        event={event}
        debtId={myDebt.id}
        currentUserId={currentUserId}
      />
    );
  }

  if (selectionDone && !myDebt) {
    return (
      <Screen
        title={event.name}
        subtitle={eventStatusLabel(event.status)}
        headerLeading={
          <IconButton
            aria-label="Назад"
            onClick={() => void navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } })}
          >
            <Icon icon={CaretLeft} weight="bold" />
          </IconButton>
        }
      >
        <p className={css.waitCard}>Ждём, пока все выберут блюда…</p>
      </Screen>
    );
  }

  return (
    <Screen
      title={event.name}
      subtitle={eventStatusLabel(event.status)}
      headerLeading={
        <IconButton
          aria-label="Назад"
          onClick={() => void navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } })}
        >
          <Icon icon={CaretLeft} weight="bold" />
        </IconButton>
      }
    >
      {isLoading ? (
        <Stack gap={4}>
          <Skeleton height={72} radius="lg" />
          <Skeleton height={72} radius="lg" />
        </Stack>
      ) : isError ? (
        <EmptyState
          title="Не удалось загрузить блюда"
          actions={
            <Button variant="secondary" onClick={() => void refetch()}>
              Повторить
            </Button>
          }
        />
      ) : (
        <>
          {receipts?.[0] ? (
            <div className={css.receiptLink}>
              <ReceiptPreview fileId={receipts[0].fileId} variant="link" />
            </div>
          ) : null}
          <div className={css.body}>
            {nonSharedPositions.map((position) => {
              const qty = quantities[position.id] ?? 0;
              const max = remainingFor(position);
              const soldOut = position.soldOut === true;
              const totalUnits = Math.floor(position.quantity);
              return (
                <div
                  key={position.id}
                  className={soldOut ? `${css.row} ${css.rowSoldOut}` : css.row}
                >
                  <div className={css.rowMain}>
                    <span className={soldOut ? css.nameSoldOut : css.name}>{position.name}</span>
                    <span className={css.meta}>
                      {formatMoney(positionUnitPriceKopecks(position))}/шт ·{' '}
                      {soldOut ? 'разобрали' : `осталось ${max} из ${totalUnits}`}
                    </span>
                  </div>
                  {!soldOut ? (
                    <div className={css.qtyStepper}>
                      <button
                        type="button"
                        className={css.qtyBtn}
                        aria-label="Меньше"
                        disabled={qty <= 0}
                        onClick={() => adjustQty(position.id, -1, max)}
                      >
                        −
                      </button>
                      <span className={css.qtyValue}>{qty}</span>
                      <button
                        type="button"
                        className={css.qtyBtn}
                        aria-label="Больше"
                        disabled={qty >= max}
                        onClick={() => adjustQty(position.id, 1, max)}
                      >
                        +
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}

            {(positions ?? []).some((p) => p.shared) ? (
              <Stack gap={3}>
                <span className={css.meta}>На всех — делятся автоматически</span>
                {(positions ?? [])
                  .filter((p) => p.shared)
                  .map((position) => (
                    <div key={position.id} className={css.row}>
                      <div className={css.rowMain}>
                        <span className={css.name}>{position.name}</span>
                        <span className={css.meta}>
                          {formatMoney(Math.round(position.totalPriceKopecks / Math.max(participantCount, 1)))} с вас
                        </span>
                      </div>
                    </div>
                  ))}
              </Stack>
            ) : null}
          </div>

          <div className={css.stickyFooter}>
            <div className={css.footerSum}>
              <span>Твоя сумма</span>
              <span className={css.footerAmount}>{formatMoney(totalKopecks)}</span>
            </div>
            <Button
              type="button"
              fullWidth
              disabled={!hasPayableSelection}
              loading={submitting}
              onClick={() => void handlePay()}
            >
              Скинуть {formatMoney(totalKopecks)}
            </Button>
          </div>
        </>
      )}
    </Screen>
  );
}
