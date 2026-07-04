import { useNavigate } from '@tanstack/react-router';
import { CalendarBlank, PlusCircle } from '@phosphor-icons/react';
import { flattenPageItems, useGroupEventsInfiniteQuery } from '../api/queries';
import * as css from './GroupEventsSection.css';
import type { EventStatus } from '@/shared/api';
import {
  Badge,
  Button,
  EmptyState,
  Icon,
  List,
  ListItem,
  Skeleton,
  Stack,
} from '@/shared/ui';
import { eventStatusLabel, formatDateTime } from '@/shared/lib';

function eventStatusTone(status: EventStatus): 'neutral' | 'warning' | 'brand' | 'success' {
  switch (status) {
    case 'DRAFT':
      return 'neutral';
    case 'DISTRIBUTION':
      return 'warning';
    case 'CALCULATED':
      return 'brand';
    case 'COMPLETED':
      return 'success';
    default:
      return 'neutral';
  }
}

interface GroupEventsSectionProps {
  groupId: number;
  onCreateEvent: () => void;
}

export function GroupEventsSection({ groupId, onCreateEvent }: GroupEventsSectionProps) {
  const navigate = useNavigate();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGroupEventsInfiniteQuery(groupId);
  const events = flattenPageItems(data?.pages);

  return (
    <Stack gap={3}>
      <span className={css.sectionLabel}>Сборы</span>
      {isLoading ? (
        <div className={css.listSkeleton}>
          <Skeleton className={css.listRow} />
          <Skeleton className={css.listRow} />
        </div>
      ) : !events.length ? (
        <EmptyState
          icon={<Icon icon={CalendarBlank} size="lg" />}
          title="Сборов пока нет"
          description="Создайте первый сбор — кто платил и за что."
          actions={
            <Button leftIcon={<Icon icon={PlusCircle} size="sm" />} onClick={onCreateEvent}>
              Создать сбор
            </Button>
          }
        />
      ) : (
        <>
          <List>
            {events.map((event) => (
              <ListItem
                key={event.id}
                leading={<Icon icon={CalendarBlank} />}
                title={event.name}
                subtitle={formatDateTime(event.updatedAt)}
                trailing={
                  <Badge tone={eventStatusTone(event.status)}>
                    {eventStatusLabel(event.status)}
                  </Badge>
                }
                onClick={() =>
                  void navigate({
                    to: '/groups/$groupId/events/$eventId',
                    params: { groupId: String(groupId), eventId: String(event.id) },
                  })
                }
              />
            ))}
          </List>
          {hasNextPage ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              loading={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              Загрузить ещё
            </Button>
          ) : null}
        </>
      )}
    </Stack>
  );
}
