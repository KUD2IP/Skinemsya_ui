import { useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CaretLeft } from '@phosphor-icons/react';
import { PayerDashboardScreen, useParticipantsStatusQuery } from '@/features/debts';
import { useEventDebtsQuery } from '@/features/debts/api/queries';
import { useGroupMembersQuery } from '@/features/groups/api/queries';
import { EventPositionsScreen } from '@/features/positions';
import { PaymentScreen } from '@/features/payments';
import { EventSelectionScreen } from '@/features/selections';
import { useEventQuery } from '../api/queries';
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
  List,
  ListItem,
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

  const memberMap = useMemo(
    () => new Map((members ?? []).map((member) => [member.userId, member])),
    [members],
  );

  const debtorLabel = (debtorId: number) => {
    if (debtorId === currentUserId) return 'Вы';
    const member = memberMap.get(debtorId);
    return member
      ? memberDisplayLabel(member.displayName, member.telegramUsername)
      : `Участник #${debtorId}`;
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
        {event.description ? (
          <p className={css.description}>{event.description}</p>
        ) : null}

        <Stack gap={3}>
          <span className={css.meta}>Итоги по участникам</span>
          <List>
            {(debts ?? []).map((debt) => (
              <ListItem
                key={debt.id}
                title={debtorLabel(debt.debtorId)}
                subtitle={debtStatusLabel(debt.status)}
                trailing={formatMoney(debt.amountKopecks)}
              />
            ))}
          </List>
        </Stack>
      </Stack>
    </Screen>
  );
}

function PayerWaitScreen({
  groupId,
  event,
}: {
  groupId: number;
  event: EventResponse;
}) {
  const navigate = useNavigate();

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
      <Card padding="lg">
        <Stack gap={3}>
          <Badge tone="brand">{eventStatusLabel(event.status)}</Badge>
          <p className={css.description}>
            Участники выбирают блюда. Когда все закончат, вы сможете проверить переводы.
          </p>
        </Stack>
      </Card>
    </Screen>
  );
}

export function EventDetailScreen({ groupId, eventId, currentUserId }: EventDetailScreenProps) {
  const navigate = useNavigate();
  const { data: event, isLoading, isError, refetch } = useEventQuery(eventId);
  const { data: debts } = useEventDebtsQuery(eventId);
  const { data: participantsStatus } = useParticipantsStatusQuery(eventId);

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

  const isPayer = currentUserId != null && event.payerId === currentUserId;
  const myDebt = (debts ?? []).find((d) => d.debtorId === currentUserId);
  const mySelectionCompleted =
    participantsStatus?.participants.find((p) => p.userId === currentUserId)?.selectionCompleted ?? false;

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
      return <PayerWaitScreen groupId={groupId} event={event} />;
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
