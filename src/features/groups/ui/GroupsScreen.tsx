import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PlusCircle, UsersThree } from '@phosphor-icons/react';
import { flattenPageItems, useGroupsInfiniteQuery } from '../api/queries';
import { CreateGroupSheet } from './CreateGroupSheet';
import { GroupListCard, GroupListPanel } from './GroupListCard';
import { GroupsSkeleton } from './GroupsSkeleton';
import * as listCss from './GroupListCard.css';
import {
  Button,
  EmptyState,
  Icon,
  Input,
  RefreshIconButton,
  Screen,
  Stack,
} from '@/shared/ui';
import { haptics, useRefreshAnimation } from '@/shared/lib';

export function GroupsScreen() {
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
  } = useGroupsInfiniteQuery();
  const groups = flattenPageItems(data?.pages);
  const { refresh, refreshing } = useRefreshAnimation(() => refetch(), isFetching);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState('');

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((group) => group.name.toLowerCase().includes(q));
  }, [groups, query]);

  const openCreate = () => {
    haptics.tap();
    setCreating(true);
  };

  return (
    <Screen
      title="Группы"
      refreshing={refreshing && !isLoading}
      headerAction={<RefreshIconButton refreshing={refreshing} onRefresh={() => void refresh()} />}
    >
      {isLoading ? (
        <GroupsSkeleton />
      ) : isError ? (
        <EmptyState
          icon={<Icon icon={UsersThree} size="lg" />}
          title="Не удалось загрузить группы"
          description="Проверьте соединение и попробуйте снова."
          actions={
            <Button variant="secondary" loading={refreshing} onClick={() => void refresh()}>
              Повторить
            </Button>
          }
        />
      ) : !groups.length ? (
        <EmptyState
          icon={<Icon icon={UsersThree} size="lg" />}
          title="Пока нет групп"
          description="Создайте группу для совместных расчётов с друзьями."
          actions={
            <Button leftIcon={<Icon icon={PlusCircle} size="sm" />} onClick={openCreate}>
              Создать группу
            </Button>
          }
        />
      ) : (
        <Stack gap={4}>
          <div className={listCss.createRow}>
            <Button fullWidth leftIcon={<Icon icon={PlusCircle} size="sm" />} onClick={openCreate}>
              Новая группа
            </Button>
          </div>

          {groups.length > 3 ? (
            <div className={listCss.searchWrap}>
              <Input
                placeholder="Поиск…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Поиск группы"
              />
            </div>
          ) : null}

          {filteredGroups.length ? (
            <>
              <p className={listCss.countLabel}>
                {query.trim()
                  ? `Найдено: ${filteredGroups.length}`
                  : `${groups.length} ${groups.length === 1 ? 'группа' : groups.length < 5 ? 'группы' : 'групп'}`}
              </p>
              <GroupListPanel>
                {filteredGroups.map((group) => (
                  <GroupListCard
                    key={group.id}
                    group={group}
                    onClick={() =>
                      void navigate({ to: '/groups/$groupId', params: { groupId: String(group.id) } })
                    }
                  />
                ))}
              </GroupListPanel>
            </>
          ) : (
            <EmptyState title="Ничего не найдено" description="Попробуйте другой запрос." />
          )}

          {hasNextPage && !query.trim() ? (
            <Button
              type="button"
              variant="secondary"
              loading={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              Загрузить ещё
            </Button>
          ) : null}
        </Stack>
      )}

      <CreateGroupSheet
        open={creating}
        onOpenChange={setCreating}
        onCreated={(groupId) =>
          void navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } })
        }
      />
    </Screen>
  );
}
