import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CaretLeft } from '@phosphor-icons/react';
import type { EventResponse } from '@/shared/api';
import { useGroupMembersQuery } from '@/features/groups/api/queries';
import {
  useConfirmAll,
  useConfirmPayer,
  useDispute,
} from '@/features/payments/api/queries';
import { isApiError } from '@/shared/api';
import { debtStatusLabel, eventStatusLabel, formatMoney, haptics, memberDisplayLabel } from '@/shared/lib';
import {
  Badge,
  Button,
  EmptyState,
  Icon,
  IconButton,
  Screen,
  Skeleton,
  Stack,
  toast,
} from '@/shared/ui';
import {
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

function debtBadgeTone(status: string): 'neutral' | 'warning' | 'success' {
  if (status === 'PAID' || status === 'PENDING_CONFIRMATION') {
    return status === 'PAID' ? 'success' : 'warning';
  }
  return 'neutral';
}

export function PayerDashboardScreen({
  groupId,
  eventId,
  event,
  currentUserId,
}: PayerDashboardScreenProps) {
  const navigate = useNavigate();
  const { data: status, isLoading, isError, refetch } = useParticipantsStatusQuery(eventId);
  const { data: debts } = useEventDebtsQuery(eventId);
  const { data: members } = useGroupMembersQuery(groupId);
  const remind = useRemindMutation(eventId);
  const confirmAll = useConfirmAll(eventId, groupId);
  const confirmPayer = useConfirmPayer(eventId, groupId);
  const dispute = useDispute(eventId, groupId);

  const memberMap = useMemo(
    () => new Map((members ?? []).map((m) => [m.userId, m])),
    [members],
  );

  const pendingDebts = useMemo(
    () => (debts ?? []).filter((d) => d.status === 'PENDING_CONFIRMATION'),
    [debts],
  );

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

  const completedPayments = status?.completedSelections ?? 0;
  const totalParticipants = status?.totalParticipants ?? 0;

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
          <Skeleton height={48} radius="md" />
          <Skeleton height={72} radius="lg" />
          <Skeleton height={72} radius="lg" />
        </Stack>
      ) : isError || !status ? (
        <EmptyState
          title="Не удалось загрузить статусы"
          actions={
            <Button variant="secondary" onClick={() => void refetch()}>
              Повторить
            </Button>
          }
        />
      ) : (
        <div className={css.body}>
          <Stack gap={2}>
            <p className={css.progress}>
              {event.status === 'DISTRIBUTION'
                ? `${completedPayments} из ${totalParticipants} выбрали`
                : 'Проверь переводы участников'}
            </p>
            <p className={css.progressMeta}>
              {event.status === 'DISTRIBUTION'
                ? 'Участники выбирают блюда'
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
            <Button
              type="button"
              variant="secondary"
              loading={remind.isPending}
              onClick={() => void handleRemind()}
            >
              Напомнить
            </Button>
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
                const statusLabel = participant.selectionCompleted
                  ? debtStatusLabel(debt?.status ?? participant.debtStatus)
                  : 'Выбирает';

                return (
                  <div key={participant.userId} className={css.participantRow}>
                    <div className={css.participantHeader}>
                      <div className={css.participantMain}>
                        <span className={css.participantName}>{label}</span>
                        {debt ? (
                          <span className={css.participantAmount}>{formatMoney(debt.amountKopecks)}</span>
                        ) : null}
                      </div>
                      <Badge tone={debtBadgeTone(debt?.status ?? participant.debtStatus)}>
                        {statusLabel}
                      </Badge>
                    </div>
                    {debt?.status === 'PENDING_CONFIRMATION' ? (
                      <div className={css.actionRow}>
                        <Button
                          type="button"
                          size="sm"
                          variant="tonal"
                          fullWidth
                          loading={confirmPayer.isPending}
                          onClick={() => void handleConfirmOne(debt.id)}
                        >
                          Всё на месте
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          fullWidth
                          loading={dispute.isPending}
                          onClick={() => void handleDispute(debt.id)}
                        >
                          Не пришло
                        </Button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
          </Stack>
        </div>
      )}
    </Screen>
  );
}
