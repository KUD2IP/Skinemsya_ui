import { CaretLeft } from '@phosphor-icons/react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { flattenPageItems, useGroupMembersInfiniteQuery } from '../api/queries';
import { MemberRow } from './MemberRow';
import * as css from './GroupMembers.css';
import {
  Button,
  EmptyState,
  Icon,
  IconButton,
  Screen,
  Skeleton,
  Stack,
} from '@/shared/ui';

export function GroupMembersScreen() {
  const navigate = useNavigate();
  const { groupId: groupIdParam } = useParams({ from: '/app/groups/$groupId/members' });
  const groupId = Number(groupIdParam);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useGroupMembersInfiniteQuery(groupId);
  const members = flattenPageItems(data?.pages);

  return (
    <Screen
      title="Участники"
      headerLeading={
        <IconButton
          aria-label="Назад"
          onClick={() =>
            void navigate({ to: '/groups/$groupId', params: { groupId: groupIdParam } })
          }
        >
          <Icon icon={CaretLeft} weight="bold" />
        </IconButton>
      }
    >
      {isLoading ? (
        <Stack gap={2}>
          <Skeleton className={css.rowSkeleton} radius="md" />
          <Skeleton className={css.rowSkeleton} radius="md" />
          <Skeleton className={css.rowSkeleton} radius="md" />
        </Stack>
      ) : isError ? (
        <EmptyState
          title="Не удалось загрузить участников"
          description="Проверьте соединение и попробуйте снова."
          actions={
            <Button variant="secondary" onClick={() => void refetch()}>
              Повторить
            </Button>
          }
        />
      ) : !members.length ? (
        <EmptyState title="Пока нет участников" description="Добавьте друзей по @username в группе." />
      ) : (
        <Stack gap={4}>
          <div className={css.membersList} role="list">
            {members.map((member) => (
              <MemberRow key={member.id} member={member} />
            ))}
          </div>
          {hasNextPage ? (
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
    </Screen>
  );
}
