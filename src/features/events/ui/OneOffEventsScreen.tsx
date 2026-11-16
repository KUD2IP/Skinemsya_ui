import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PlayCircle, Plus, Receipt } from '@phosphor-icons/react';
import type { EventStatus } from '@/shared/api';
import {
  Badge,
  Button,
  EmptyState,
  Icon,
  Input,
  List,
  ListItem,
  RefreshIconButton,
  Screen,
  SkeletonList,
  Stack,
} from '@/shared/ui';
import { eventStatusLabel, formatDateTime, haptics, useRefreshAnimation } from '@/shared/lib';
import { eventCapacityLabel } from '../model/eventRoster';
import {
  flattenPageItems,
  useOneOffEventsInfiniteQuery,
} from '../api/queries';
import { CreateOneOffEventSheet } from './CreateOneOffEventSheet';
import * as css from './OneOffEventsScreen.css';

function statusTone(status: EventStatus): 'neutral' | 'warning' | 'brand' | 'success' {
  switch (status) {
    case 'DRAFT':
      return 'neutral';
    case 'DISTRIBUTION':
      return 'warning';
    case 'CALCULATED':
      return 'brand';
    case 'COMPLETED':
      return 'success';
  }
}

export function OneOffEventsScreen() {
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOneOffEventsInfiniteQuery();
  const events = flattenPageItems(data?.pages);
  const { refresh, refreshing } = useRefreshAnimation(() => refetch(), isFetching);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');

  const filteredEvents = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return events;
    return events.filter((event) => event.name.toLowerCase().includes(q));
  }, [events, query]);

  const openCreate = () => {
    haptics.tap();
    setCreating(true);
  };

  const openEvent = (eventId: number, groupId: number) => {
    void navigate({
      to: '/groups/$groupId/events/$eventId',
      params: { groupId: String(groupId), eventId: String(eventId) },
    });
  };

  return (
    <Screen
      title="Сборы"
      refreshing={refreshing && !isLoading}
      headerAction={<RefreshIconButton refreshing={refreshing} onRefresh={() => void refresh()} />}
    >
      {isLoading ? (
        <Stack gap={4}>
          <SkeletonList rows={4} />
        </Stack>
      ) : isError ? (
        <EmptyState
          icon={<Icon icon={Receipt} size="lg" />}
          title="Не удалось загрузить сборы"
          description="Проверьте соединение и попробуйте снова."
          actions={
            <Button variant="secondary" loading={refreshing} onClick={() => void refresh()}>
              Повторить
            </Button>
          }
        />
      ) : !events.length ? (
        <EmptyState
          icon={<Icon icon={Receipt} size="lg" />}
          title="Создайте разовый сбор"
          description="Без отдельной группы: добавьте чек и пригласите участников по защищённой ссылке."
          actions={
            <div className={css.emptyActions}>
              <Button
                fullWidth
                leftIcon={<Icon icon={Plus} size="sm" weight="bold" />}
                onClick={openCreate}
              >
                Создать сбор
              </Button>
              <Button
                fullWidth
                variant="secondary"
                leftIcon={<Icon icon={PlayCircle} size="sm" />}
                onClick={() => void navigate({ to: '/demo' })}
              >
                Посмотреть, как это работает
              </Button>
            </div>
          }
        />
      ) : (
        <Stack gap={4}>
          <div className={css.createRow}>
            <Button
              fullWidth
              leftIcon={<Icon icon={Plus} size="sm" weight="bold" />}
              onClick={openCreate}
            >
              Новый сбор
            </Button>
          </div>

          {events.length > 3 ? (
            <div className={css.searchWrap}>
              <Input
                placeholder="Поиск…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Поиск сбора"
              />
            </div>
          ) : null}

          {filteredEvents.length ? (
            <>
              <p className={css.countLabel}>
                {query.trim()
                  ? `Найдено: ${filteredEvents.length}`
                  : `${events.length} ${events.length === 1 ? 'сбор' : events.length < 5 ? 'сбора' : 'сборов'}`}
              </p>
              <List>
                {filteredEvents.map((event) => (
                  <ListItem
                    key={event.id}
                    leading={<Icon icon={Receipt} />}
                    title={event.name}
                    subtitle={`${eventCapacityLabel(event)} · ${formatDateTime(event.updatedAt)}`}
                    trailing={
                      <Badge tone={statusTone(event.status)}>{eventStatusLabel(event.status)}</Badge>
                    }
                    onClick={() => openEvent(event.id, event.groupId)}
                  />
                ))}
              </List>
            </>
          ) : (
            <EmptyState title="Ничего не найдено" description="Попробуйте другой запрос." />
          )}

          {hasNextPage && !query.trim() ? (
            <Button
              variant="secondary"
              loading={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              Загрузить ещё
            </Button>
          ) : null}
        </Stack>
      )}

      <CreateOneOffEventSheet
        open={creating}
        onOpenChange={setCreating}
        onCreated={(event) => openEvent(event.id, event.groupId)}
      />
    </Screen>
  );
}
