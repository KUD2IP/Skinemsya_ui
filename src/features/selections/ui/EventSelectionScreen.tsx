import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
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
import { EventCapacityBar } from '@/features/events/ui/EventCapacityBar';
import { DeleteEventControl } from '@/features/events/ui/DeleteEventControl';
import { useCompleteSelection, useReopenSelection, useUpdateSelections } from '../api/queries';
import {
  leftoverQuantity,
  selectedShareKopecks,
  selectionItemsForUser,
  sharedShareKopecks,
} from '../model/selectionSummary';
import { useSelectionReopen } from '../model/useSelectionReopen';
import { SelectionSummary } from './SelectionSummary';
import * as css from './EventSelectionScreen.css';

interface EventSelectionScreenProps {
  groupId: number;
  eventId: number;
  event: EventResponse;
  currentUserId?: number;
}

function remainingFor(position: PositionResponse, currentUserId?: number): number {
  if (position.shared) return 0;
  if (position.remainingQuantity != null) return position.remainingQuantity;
  const total = Math.floor(position.quantity);
  const takenByOthers = (position.selectedBy ?? [])
    .filter((selector) => selector.userId !== currentUserId)
    .reduce((sum, selector) => sum + selector.quantity, 0);
  return Math.max(0, total - takenByOthers);
}

function isSoldOut(position: PositionResponse, currentUserId?: number): boolean {
  if (position.soldOut != null) return position.soldOut;
  const remaining = remainingFor(position, currentUserId);
  const mine = position.mySelectedQuantity ?? 0;
  return remaining <= 0 && mine <= 0;
}

function sortSelectablePositions(
  positions: PositionResponse[],
  currentUserId?: number,
): PositionResponse[] {
  return [...positions].sort((a, b) => {
    const aSoldOut = isSoldOut(a, currentUserId);
    const bSoldOut = isSoldOut(b, currentUserId);
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
  const { edit } = useSearch({ from: '/app/groups/$groupId/events/$eventId' });
  const { data: positions, isLoading, isError, refetch } = usePositionsQuery(eventId, {
    refetchInterval: 3000,
  });
  const { data: receipts } = useEventReceiptsQuery(eventId);
  const { data: participantsStatus } = useParticipantsStatusQuery(eventId);
  const { data: debts, refetch: refetchDebts } = useEventDebtsQuery(eventId);
  const updateSelections = useUpdateSelections(eventId);
  const completeSelection = useCompleteSelection(eventId, groupId);
  const reopenSelection = useReopenSelection(eventId, groupId);
  const { canReopen, handleReopen, isReopening } = useSelectionReopen(
    eventId,
    groupId,
    event.status,
    debts,
  );
  const myItems = selectionItemsForUser(
    positions,
    currentUserId,
    event.expectedParticipantCount,
    currentUserId,
    event.payerId,
  );

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
        const max = remainingFor(position, currentUserId);
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
  }, [currentUserId, positions]);

  const participantCount = event.expectedParticipantCount;

  const nonSharedPositions = useMemo(
    () => sortSelectablePositions((positions ?? []).filter((p) => !p.shared), currentUserId),
    [currentUserId, positions],
  );

  const totalKopecks = useMemo(() => {
    if (!positions) return 0;
    return positions.reduce((sum, position) => {
      const qty = quantities[position.id] ?? 0;
      if (position.shared) {
        return sum + sharedShareKopecks(position.totalPriceKopecks, participantCount);
      }
      if (qty <= 0) return sum;
      return sum + selectedShareKopecks(position.totalPriceKopecks, qty, position.quantity);
    }, 0);
  }, [participantCount, positions, quantities]);

  const hasPayableSelection = useMemo(() => {
    if (!positions?.length) return false;
    const hasNonSharedQty = Object.values(quantities).some((qty) => qty > 0);
    const hasShared = positions.some((p) => p.shared);
    return hasNonSharedQty || hasShared;
  }, [positions, quantities]);

  const hasUnsavedChanges = useMemo(() => {
    if (!positions?.length) return false;
    return positions.some((position) => {
      if (position.shared) return false;
      const local = quantities[position.id] ?? 0;
      const server = position.mySelectedQuantity ?? 0;
      return local !== server;
    });
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

  const persistSelection = async () => {
    if (edit && event.status === 'CALCULATED') {
      await reopenSelection.mutateAsync();
    }
    const selections = buildSelectionsPayload();
    if (selections.length) {
      await updateSelections.mutateAsync({ selections });
    }
    await completeSelection.mutateAsync();
  };

  const leaveEditMode = async () => {
    await navigate({
      to: '/groups/$groupId/events/$eventId',
      params: { groupId: String(groupId), eventId: String(eventId) },
      search: {},
    });
  };

  const handlePay = async () => {
    if (!hasPayableSelection) return;
    setSubmitting(true);
    try {
      await persistSelection();
      if (edit) {
        await leaveEditMode();
        haptics.success();
        return;
      }
      const { data: updatedDebts } = await refetchDebts();
      const debt = updatedDebts?.find((d) => d.debtorId === currentUserId);
      haptics.success();
      if (debt) {
        setShowPayment(true);
      } else {
        toast.info('Выбор сохранён.');
      }
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось сохранить выбор');
      void refetch();
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = async () => {
    if (!edit) {
      await navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } });
      return;
    }
    if (!hasUnsavedChanges || !canReopen) {
      await leaveEditMode();
      return;
    }
    setSubmitting(true);
    try {
      await persistSelection();
      await leaveEditMode();
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

  if (selectionDone && !myDebt && !edit) {
    return (
      <Screen
        title={event.name}
        subtitle={eventStatusLabel(event.status)}
        headerLeading={
          <IconButton
            aria-label="Назад"
            onClick={() => void handleBack()}
          >
            <Icon icon={CaretLeft} weight="bold" />
          </IconButton>
        }
      >
        <Stack gap={4}>
          <EventCapacityBar event={event} currentUserId={currentUserId} />
          <p className={css.waitCard}>Ждём, пока все выберут позиции…</p>
          <SelectionSummary
            title="Твои позиции"
            items={myItems}
            onEdit={canReopen ? () => void handleReopen() : undefined}
            editing={isReopening}
          />
        </Stack>
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
            onClick={() => void handleBack()}
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
          title="Не удалось загрузить позиции"
          actions={
            <Button variant="secondary" onClick={() => void refetch()}>
              Повторить
            </Button>
          }
        />
      ) : (
        <>
          <EventCapacityBar event={event} currentUserId={currentUserId} />
          {receipts?.[0] ? (
            <div className={css.receiptLink}>
              <ReceiptPreview fileId={receipts[0].fileId} variant="link" />
            </div>
          ) : null}
          <div className={css.body}>
            {nonSharedPositions.map((position) => {
              const qty = quantities[position.id] ?? 0;
              const max = remainingFor(position, currentUserId);
              const soldOut = isSoldOut(position, currentUserId);
              const totalUnits = Math.floor(position.quantity);
              const leftover = leftoverQuantity(position);
              const leftoverHint =
                leftover > 0 && currentUserId === event.payerId
                  ? `осталось ${max} из ${totalUnits} · невзятое останется вам`
                  : `осталось ${max} из ${totalUnits}`;
              return (
                <div
                  key={position.id}
                  className={soldOut ? `${css.row} ${css.rowSoldOut}` : css.row}
                >
                  <div className={css.rowTop}>
                    <span className={soldOut ? css.nameSoldOut : css.name}>{position.name}</span>
                    <span className={css.price}>{formatMoney(position.totalPriceKopecks)}</span>
                  </div>
                  <div className={css.rowBottom}>
                    <span className={css.meta}>
                      {formatMoney(positionUnitPriceKopecks(position))}/шт ·{' '}
                      {soldOut ? 'разобрали' : leftoverHint}
                    </span>
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
                      <div className={css.rowTop}>
                        <span className={css.name}>{position.name}</span>
                        <span className={css.price}>{formatMoney(position.totalPriceKopecks)}</span>
                      </div>
                      <div className={css.rowBottom}>
                        <span className={css.meta}>
                          {formatMoney(sharedShareKopecks(position.totalPriceKopecks, participantCount))} с вас
                        </span>
                      </div>
                    </div>
                  ))}
              </Stack>
            ) : null}

            <DeleteEventControl groupId={groupId} event={event} currentUserId={currentUserId} />
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
