import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import type { DebtResponse, EventResponse } from '@/shared/api';
import { groupKeys, useGroupMembersQuery } from '@/features/groups/api/queries';
import {
  useConfirmAll,
  useConfirmPayer,
  useDispute,
} from '@/features/payments/api/queries';
import { isApiError } from '@/shared/api';
import { debtStatusLabel, eventStatusLabel, formatMoney, haptics, memberDisplayLabel, paymentStatusLabel, useScreenRefresh, zeroDebtStatusLabel } from '@/shared/lib';
import {
  Badge,
  Button,
  EmptyState,
  Icon,
  IconButton,
  RefreshIconButton,
  Screen,
  Skeleton,
  Stack,
  toast,
} from '@/shared/ui';
import { eventKeys, useCloseEvent } from '@/features/events/api/queries';
import { EventCapacityBar } from '@/features/events/ui/EventCapacityBar';
import { DeleteEventControl } from '@/features/events/ui/DeleteEventControl';
import { FilePreview } from '@/features/files/ui/FilePreview';
import { positionKeys, usePositionsQuery } from '@/features/positions/api/queries';
import { SelectionSummary } from '@/features/selections/ui/SelectionSummary';
import { selectionItemsForUser } from '@/features/selections/model/selectionSummary';
import { useSelectionReopen } from '@/features/selections/model/useSelectionReopen';
import {
  debtKeys,
  useEventDebtsQuery,
  useParticipantsStatusQuery,
  useRemindMutation,
} from '../api/queries';
import * as css from './PayerDashboardScreen.css';

interface PayerDashboardScreenProps {
  groupId: number;
  eventId: number;
  event: EventResponse;
  currentUserId?: number;
}

function participantBadgeTone(
  debt: DebtResponse | undefined,
  fallbackDebtStatus: string,
): 'neutral' | 'warning' | 'success' | 'danger' {
  if (debt?.paymentStatus === 'DISPUTED') {
    return 'danger';
  }
  if (debt?.paymentStatus === 'DEBTOR_CONFIRMED') {
    return 'warning';
  }
  const status = debt?.status ?? fallbackDebtStatus;
  if (status === 'PAID') {
    return 'success';
  }
  if (status === 'PENDING_CONFIRMATION') {
    return 'warning';
  }
  return 'neutral';
}

function canPayerConfirm(debt: DebtResponse): boolean {
  return debt.status === 'PENDING_CONFIRMATION'
    && (!debt.paymentStatus || debt.paymentStatus === 'DEBTOR_CONFIRMED' || debt.paymentStatus === 'DISPUTED');
}

function canPayerDispute(debt: DebtResponse): boolean {
  return debt.status === 'PENDING_CONFIRMATION'
    && (!debt.paymentStatus || debt.paymentStatus === 'DEBTOR_CONFIRMED');
}

function shouldShowPaymentProof(debt: DebtResponse): boolean {
  return debt.screenshotFileId != null
    && (debt.paymentStatus === 'DEBTOR_CONFIRMED' || debt.paymentStatus === 'DISPUTED');
}

function participantStatusLabel(
  debt: DebtResponse | undefined,
  fallbackDebtStatus: string,
  selectionCompleted: boolean,
  eventStatus: EventResponse['status'],
): string {
  if (debt?.paymentStatus === 'DISPUTED') {
    return paymentStatusLabel('DISPUTED');
  }
  if (debt?.paymentStatus === 'DEBTOR_CONFIRMED' || debt?.status === 'PENDING_CONFIRMATION') {
    return paymentStatusLabel('DEBTOR_CONFIRMED');
  }
  if (debt?.status === 'PAID') {
    return debtStatusLabel('PAID');
  }
  if (debt?.status === 'UNPAID' && (eventStatus === 'CALCULATED' || selectionCompleted)) {
    return debtStatusLabel('UNPAID');
  }
  if (!selectionCompleted) {
    return 'Выбирает';
  }
  const status = debt?.status ?? fallbackDebtStatus;
  if (!status || status === 'NONE') {
    return zeroDebtStatusLabel(true);
  }
  return debtStatusLabel(status);
}

export function PayerDashboardScreen({
  groupId,
  eventId,
  event,
  currentUserId,
}: PayerDashboardScreenProps) {
  const navigate = useNavigate();
  const { data: status, isLoading, isError } = useParticipantsStatusQuery(eventId);
  const { data: debts, refetch: refetchDebts } = useEventDebtsQuery(eventId);
  const { refresh, refreshing } = useScreenRefresh([
    debtKeys.participants(eventId),
    debtKeys.byEvent(eventId),
    groupKeys.members(groupId),
    positionKeys.byEvent(eventId),
    eventKeys.detail(eventId),
  ]);
  const { data: members } = useGroupMembersQuery(groupId);
  const { data: positions } = usePositionsQuery(eventId);
  const { canReopen, handleReopen, isReopening } = useSelectionReopen(
    eventId,
    groupId,
    event.status,
    debts,
  );
  const remind = useRemindMutation(eventId);
  const confirmAll = useConfirmAll(eventId, groupId);
  const confirmPayer = useConfirmPayer(eventId, groupId);
  const dispute = useDispute(eventId, groupId);
  const closeEvent = useCloseEvent(eventId, groupId);

  const memberMap = useMemo(
    () => new Map((members ?? []).map((m) => [m.userId, m])),
    [members],
  );

  const pendingDebts = useMemo(
    () => (debts ?? []).filter((d) => d.status === 'PENDING_CONFIRMATION'),
    [debts],
  );

  useEffect(() => {
    if (pendingDebts.length === 0) return;

    const poll = () => void refetchDebts();
    const onVisible = () => {
      if (document.visibilityState === 'visible') poll();
    };

    document.addEventListener('visibilitychange', onVisible);
    const intervalId = window.setInterval(poll, 3_000);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(intervalId);
    };
  }, [pendingDebts.length, refetchDebts]);

  const canCloseEvent = useMemo(() => {
    if (event.status !== 'CALCULATED') {
      return false;
    }
    const payerDebts = (debts ?? []).filter((d) => d.creditorId === currentUserId);
    if (payerDebts.length === 0) {
      return true;
    }
    return payerDebts.every((d) => d.status === 'PAID');
  }, [debts, event.status, currentUserId]);

  const handleConfirmAll = async () => {
    try {
      await confirmAll.mutateAsync();
      haptics.success();
      toast.success('Все переводы подтверждены');
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось подтвердить');
    }
  };

  const handleConfirmOne = async (debtId: number) => {
    try {
      await confirmPayer.mutateAsync(debtId);
      haptics.success();
      toast.success('Подтверждено');
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось подтвердить');
    }
  };

  const handleDispute = async (debtId: number) => {
    try {
      await dispute.mutateAsync(debtId);
      haptics.success();
      toast.success('Отмечено как не пришедшее');
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось отметить');
    }
  };

  const handleRemind = async () => {
    try {
      await remind.mutateAsync();
      haptics.success();
      toast.success('Напоминание отправлено');
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось отправить напоминание');
    }
  };

  const handleCloseEvent = async () => {
    try {
      await closeEvent.mutateAsync();
      haptics.success();
      toast.success('Сбор закрыт');
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось закрыть сбор');
    }
  };

  const completedPayments = status?.completedSelections ?? 0;
  const totalParticipants = status?.totalParticipants ?? 0;
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpanded = (id: number) => {
    setExpandedId((current) => (current === id ? null : id));
  };

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
      refreshing={refreshing && !isLoading}
      headerAction={<RefreshIconButton refreshing={refreshing} onRefresh={() => void refresh()} />}
    >
      {isLoading ? (
        <Stack gap={4}>
          <Skeleton height={48} radius="md" />
          <Skeleton height={72} radius="lg" />
          <Skeleton height={72} radius="lg" />
        </Stack>
      ) : isError || !status ? (
        <EmptyState
          title="Не удалось загрузить статусы"
          actions={
            <Button variant="secondary" loading={refreshing} onClick={() => void refresh()}>
              Повторить
            </Button>
          }
        />
      ) : (
        <div className={css.body}>
          <EventCapacityBar event={event} currentUserId={currentUserId} />
          <Stack gap={2}>
            <p className={css.progress}>
              {event.status === 'DISTRIBUTION'
                ? `${completedPayments} из ${status.joinedCount ?? totalParticipants} выбрали`
                : 'Проверь переводы участников'}
            </p>
            <p className={css.progressMeta}>
              {event.status === 'DISTRIBUTION'
                ? 'Участники выбирают позиции'
                : 'Подтверди получение или отметь проблему'}
            </p>
          </Stack>

          <div className={css.toolbar}>
            {pendingDebts.length > 0 ? (
              <Button
                type="button"
                loading={confirmAll.isPending}
                onClick={() => void handleConfirmAll()}
              >
                Всё на месте
              </Button>
            ) : null}
            {canCloseEvent ? (
              <Button
                type="button"
                variant="tonal"
                loading={closeEvent.isPending}
                onClick={() => void handleCloseEvent()}
              >
                Сбор закрыт
              </Button>
            ) : null}
            <Button
              type="button"
              variant="secondary"
              loading={remind.isPending}
              onClick={() => void handleRemind()}
            >
              Напомнить
            </Button>
            {canReopen ? (
              <Button
                type="button"
                variant="secondary"
                loading={isReopening}
                onClick={() => void handleReopen()}
              >
                Изменить выбор
              </Button>
            ) : null}
          </div>

          <Stack gap={3}>
            {status.participants
              .filter((p) => p.userId !== currentUserId)
              .map((participant) => {
                const member = memberMap.get(participant.userId);
                const debt = (debts ?? []).find((d) => d.debtorId === participant.userId);
                const label = member
                  ? memberDisplayLabel(member.displayName, member.telegramUsername)
                  : `Участник #${participant.userId}`;
                const statusLabel = participantStatusLabel(
                  debt,
                  participant.debtStatus,
                  participant.selectionCompleted,
                  event.status,
                );
                const showConfirm = debt ? canPayerConfirm(debt) : false;
                const showDispute = debt ? canPayerDispute(debt) : false;
                const participantItems = selectionItemsForUser(
                  positions,
                  participant.userId,
                  status.expectedParticipantCount ?? event.expectedParticipantCount,
                  currentUserId,
                  event.payerId,
                );
                const isExpanded = expandedId === participant.userId;

                return (
                  <div key={participant.userId} className={css.participantRow}>
                    <button
                      type="button"
                      className={css.participantHeader}
                      aria-expanded={isExpanded}
                      onClick={() => {
                        toggleExpanded(participant.userId);
                      }}
                    >
                      <Icon
                        icon={isExpanded ? CaretDown : CaretRight}
                        size="sm"
                        className={css.caret}
                      />
                      <div className={css.participantMain}>
                        <span className={css.participantName}>{label}</span>
                        {debt ? (
                          <span className={css.participantAmount}>{formatMoney(debt.amountKopecks)}</span>
                        ) : null}
                      </div>
                      <Badge tone={participantBadgeTone(debt, participant.debtStatus)}>
                        {statusLabel}
                      </Badge>
                    </button>
                    {isExpanded ? (
                      <SelectionSummary items={participantItems} variant="plain" />
                    ) : null}
                    {debt && shouldShowPaymentProof(debt) ? (
                      <FilePreview
                        fileId={debt.screenshotFileId!}
                        variant="link"
                        linkLabel="Чек перевода"
                        sheetTitle="Чек перевода"
                      />
                    ) : null}
                    {showConfirm || showDispute ? (
                      <div
                        className={css.actionRow}
                        onClick={(event) => event.stopPropagation()}
                      >
                        {showConfirm ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="tonal"
                            fullWidth
                            loading={confirmPayer.isPending}
                            onClick={() => void handleConfirmOne(debt!.id)}
                          >
                            Всё на месте
                          </Button>
                        ) : null}
                        {showDispute ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            fullWidth
                            loading={dispute.isPending}
                            onClick={() => void handleDispute(debt!.id)}
                          >
                            Не пришло
                          </Button>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                );
              })}
          </Stack>
          <DeleteEventControl groupId={groupId} event={event} currentUserId={currentUserId} />
        </div>
      )}
    </Screen>
  );
}
