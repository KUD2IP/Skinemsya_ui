import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CaretDown, CaretLeft, CaretRight } from '@phosphor-icons/react';
import { PayerDashboardScreen, useParticipantsStatusQuery } from '@/features/debts';
import { useEventDebtsQuery } from '@/features/debts/api/queries';
import { useGroupMembersQuery } from '@/features/groups/api/queries';
import { EventPositionsScreen } from '@/features/positions';
import { usePositionsQuery } from '@/features/positions/api/queries';
import { PaymentScreen } from '@/features/payments';
import { EventSelectionScreen } from '@/features/selections/ui/EventSelectionScreen';
import { SelectionSummary } from '@/features/selections/ui/SelectionSummary';
import { selectionItemsForUser } from '@/features/selections/model/selectionSummary';
import { useSelectionReopen } from '@/features/selections/model/useSelectionReopen';
import { useEventQuery, useJoinEvent } from '../api/queries';
import { canJoinEvent } from '../model/eventRoster';
import { EventCapacityBar } from './EventCapacityBar';
import { DeleteEventControl } from './DeleteEventControl';
import { EventDetailSkeleton } from './EventDetailSkeleton';
import * as css from './EventDetailScreen.css';
import type { EventResponse } from '@/shared/api';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
  IconButton,
  Screen,
  Stack,
} from '@/shared/ui';
import {
  debtStatusLabel,
  eventStatusLabel,
  formatDateTime,
  formatMoney,
  memberDisplayLabel,
} from '@/shared/lib';

interface EventDetailScreenProps {
  groupId: number;
  eventId: number;
  currentUserId?: number;
}

function CompletedEventSummary({
  groupId,
  event,
  currentUserId,
}: {
  groupId: number;
  event: EventResponse;
  currentUserId?: number;
}) {
  const navigate = useNavigate();
  const { data: debts } = useEventDebtsQuery(event.id);
  const { data: members } = useGroupMembersQuery(groupId);
  const { data: positions } = usePositionsQuery(event.id);
  const { data: participantsStatus } = useParticipantsStatusQuery(event.id);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const participantCount = event.expectedParticipantCount;

  const memberMap = useMemo(
    () => new Map((members ?? []).map((member) => [member.userId, member])),
    [members],
  );

  const people = useMemo(() => {
    const byId = new Map(
      (participantsStatus?.participants ?? []).map((participant) => [participant.userId, participant]),
    );
    if (!byId.has(event.payerId)) {
      byId.set(event.payerId, {
        userId: event.payerId,
        selectionCompleted: true,
        debtStatus: '',
      });
    }
    for (const debt of debts ?? []) {
      if (!byId.has(debt.debtorId)) {
        byId.set(debt.debtorId, {
          userId: debt.debtorId,
          selectionCompleted: true,
          debtStatus: debt.status,
        });
      }
    }
    return [...byId.values()].sort((left, right) => {
      if (left.userId === event.payerId) return -1;
      if (right.userId === event.payerId) return 1;
      return 0;
    });
  }, [debts, event.payerId, participantsStatus?.participants]);

  const personLabel = (userId: number) => {
    if (userId === currentUserId) return 'Вы';
    const member = memberMap.get(userId);
    return member
      ? memberDisplayLabel(member.displayName, member.telegramUsername)
      : `Участник #${userId}`;
  };

  return (
    <Screen
      title={event.name}
      subtitle={`${eventStatusLabel(event.status)} · ${formatDateTime(event.updatedAt)}`}
      headerLeading={
        <IconButton
          aria-label="Назад"
          onClick={() => void navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } })}
        >
          <Icon icon={CaretLeft} weight="bold" />
        </IconButton>
      }
    >
      <Stack gap={6}>
        <EventCapacityBar event={event} currentUserId={currentUserId} />
        {event.description ? (
          <p className={css.description}>{event.description}</p>
        ) : null}

        <Stack gap={3}>
          <span className={css.meta}>Итоги по участникам</span>
          {people.map((person) => {
            const isPayer = person.userId === event.payerId;
            const debt = (debts ?? []).find((item) => item.debtorId === person.userId);
            const items = selectionItemsForUser(
              positions,
              person.userId,
              participantCount,
              currentUserId,
              event.payerId,
            );
            const isExpanded = expandedId === person.userId;

            return (
              <div key={person.userId} className={css.participantRow}>
                <button
                  type="button"
                  className={css.participantHeader}
                  aria-expanded={isExpanded}
                  onClick={() => {
                    setExpandedId((current) => (current === person.userId ? null : person.userId));
                  }}
                >
                  <Icon
                    icon={isExpanded ? CaretDown : CaretRight}
                    size="sm"
                    className={css.caret}
                  />
                  <div className={css.participantMain}>
                    <span className={css.participantName}>{personLabel(person.userId)}</span>
                    {debt ? (
                      <span className={css.participantAmount}>{formatMoney(debt.amountKopecks)}</span>
                    ) : isPayer ? (
                      <span className={css.participantAmount}>Платил</span>
                    ) : null}
                  </div>
                  <Badge tone={isPayer ? 'brand' : 'success'}>
                    {isPayer ? 'Плательщик' : debtStatusLabel(debt?.status ?? person.debtStatus)}
                  </Badge>
                </button>
                {isExpanded ? <SelectionSummary items={items} variant="plain" /> : null}
              </div>
            );
          })}
        </Stack>
        <DeleteEventControl groupId={groupId} event={event} currentUserId={currentUserId} />
      </Stack>
    </Screen>
  );
}

function PayerWaitScreen({
  groupId,
  event,
  currentUserId,
}: {
  groupId: number;
  event: EventResponse;
  currentUserId?: number;
}) {
  const navigate = useNavigate();
  const { data: positions } = usePositionsQuery(event.id);
  const { data: debts } = useEventDebtsQuery(event.id);
  const { canReopen, handleReopen, isReopening } = useSelectionReopen(
    event.id,
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
      <Stack gap={4}>
        <EventCapacityBar event={event} currentUserId={currentUserId} />
        <Card padding="lg">
          <Stack gap={3}>
            <Badge tone="brand">{eventStatusLabel(event.status)}</Badge>
            <p className={css.description}>
              Участники выбирают позиции. Когда все закончат, вы сможете проверить переводы.
            </p>
          </Stack>
        </Card>
        <SelectionSummary
          title="Твои позиции"
          items={myItems}
          onEdit={canReopen ? () => void handleReopen() : undefined}
          editing={isReopening}
        />
        <DeleteEventControl groupId={groupId} event={event} currentUserId={currentUserId} />
      </Stack>
    </Screen>
  );
}

export function EventDetailScreen({ groupId, eventId, currentUserId }: EventDetailScreenProps) {
  const navigate = useNavigate();
  const { edit } = useSearch({ from: '/app/groups/$groupId/events/$eventId' });
  const { data: event, isLoading, isError, refetch } = useEventQuery(eventId);
  const join = useJoinEvent(eventId, groupId);
  const { data: debts } = useEventDebtsQuery(eventId, event?.currentUserJoined === true);
  const { data: participantsStatus } = useParticipantsStatusQuery(eventId, event?.currentUserJoined === true);

  useEffect(() => {
    if (!event || !canJoinEvent(event) || join.isPending || join.isSuccess || join.isError) {
      return;
    }
    join.mutate();
  }, [event, join.isError, join.isPending, join.isSuccess, join.mutate]);

  if (isLoading) {
    return (
      <Screen
        title="Сбор"
        headerLeading={
          <IconButton
            aria-label="Назад"
            onClick={() => void navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } })}
          >
            <Icon icon={CaretLeft} weight="bold" />
          </IconButton>
        }
      >
        <EventDetailSkeleton />
      </Screen>
    );
  }

  if (isError || !event) {
    return (
      <Screen
        title="Сбор"
        headerLeading={
          <IconButton
            aria-label="Назад"
            onClick={() => void navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } })}
          >
            <Icon icon={CaretLeft} weight="bold" />
          </IconButton>
        }
      >
        <EmptyState
          title="Сбор не найден"
          actions={
            <Button variant="secondary" onClick={() => void refetch()}>
              Повторить
            </Button>
          }
        />
      </Screen>
    );
  }

  if (!event.currentUserJoined) {
    const joining = join.isPending || (canJoinEvent(event) && !join.isError);
    return (
      <Screen
        title={event.name}
        headerLeading={
          <IconButton
            aria-label="Назад"
            onClick={() => void navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } })}
          >
            <Icon icon={CaretLeft} weight="bold" />
          </IconButton>
        }
      >
        {joining ? (
          <EventDetailSkeleton />
        ) : join.isError ? (
          <EmptyState
            title="Не удалось войти в сбор"
            actions={
              <Button variant="secondary" onClick={() => join.reset()}>
                Повторить
              </Button>
            }
          />
        ) : (
          <Stack gap={6}>
            <EmptyState
              title={event.status === 'COMPLETED' ? 'Вы не участвовали в этом сборе' : 'Сбор набран'}
              description={`${event.joinedCount}/${event.expectedParticipantCount} уже в сборе`}
            />
            <DeleteEventControl groupId={groupId} event={event} currentUserId={currentUserId} />
          </Stack>
        )}
      </Screen>
    );
  }

  const isPayer = currentUserId != null && event.payerId === currentUserId;
  const myDebt = (debts ?? []).find((d) => d.debtorId === currentUserId);
  const mySelectionCompleted =
    participantsStatus?.participants.find((p) => p.userId === currentUserId)?.selectionCompleted ?? false;

  if (edit && (event.status === 'DISTRIBUTION' || event.status === 'CALCULATED')) {
    return (
      <EventSelectionScreen
        groupId={groupId}
        eventId={eventId}
        event={event}
        currentUserId={currentUserId}
      />
    );
  }

  switch (event.status) {
    case 'DRAFT':
      return (
        <EventPositionsScreen
          groupId={groupId}
          eventId={eventId}
          event={event}
          currentUserId={currentUserId}
        />
      );
    case 'DISTRIBUTION':
      if (!mySelectionCompleted) {
        return (
          <EventSelectionScreen
            groupId={groupId}
            eventId={eventId}
            event={event}
            currentUserId={currentUserId}
          />
        );
      }
      if (isPayer) {
        return (
          <PayerDashboardScreen
            groupId={groupId}
            eventId={eventId}
            event={event}
            currentUserId={currentUserId}
          />
        );
      }
      if (myDebt) {
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
      return (
        <EventSelectionScreen
          groupId={groupId}
          eventId={eventId}
          event={event}
          currentUserId={currentUserId}
        />
      );
    case 'CALCULATED':
      if (isPayer) {
        return (
          <PayerDashboardScreen
            groupId={groupId}
            eventId={eventId}
            event={event}
            currentUserId={currentUserId}
          />
        );
      }
      if (myDebt) {
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
      return <PayerWaitScreen groupId={groupId} event={event} currentUserId={currentUserId} />;
    case 'COMPLETED':
      return (
        <CompletedEventSummary
          groupId={groupId}
          event={event}
          currentUserId={currentUserId}
        />
      );
    default:
      return null;
  }
}
