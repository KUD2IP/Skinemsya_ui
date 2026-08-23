import { useState } from 'react';
import { CaretLeft } from '@phosphor-icons/react';
import { useNavigate, useParams } from '@tanstack/react-router';
import {
  flattenPageItems,
  groupKeys,
  useGroupInviteLinkQuery,
  useGroupMembersInfiniteQuery,
  useGroupQuery,
  useRemoveGroupMember,
} from '../api/queries';
import { InviteLinkButton } from './InviteLinkButton';
import { useProfileQuery } from '@/features/profile/api/queries';
import { MemberRow } from './MemberRow';
import * as css from './GroupMembers.css';
import { isApiError } from '@/shared/api';
import type { GroupMemberViewResponse } from '@/shared/api';
import {
  Button,
  EmptyState,
  Icon,
  IconButton,
  RefreshIconButton,
  Screen,
  Sheet,
  Skeleton,
  Stack,
  toast,
} from '@/shared/ui';
import { haptics, memberDisplayLabel, useScreenRefresh } from '@/shared/lib';

export function GroupMembersScreen() {
  const navigate = useNavigate();
  const { groupId: groupIdParam } = useParams({ from: '/app/groups/$groupId/members' });
  const groupId = Number(groupIdParam);
  const { data: user } = useProfileQuery();
  const { data: group } = useGroupQuery(groupId);
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGroupMembersInfiniteQuery(groupId);
  const { refresh, refreshing } = useScreenRefresh([
    groupKeys.members(groupId),
    groupKeys.detail(groupId),
  ]);
  const removeMember = useRemoveGroupMember(groupId);
  const inviteLink = useGroupInviteLinkQuery(groupId);
  const members = flattenPageItems(data?.pages);
  const isOwner = user != null && group != null && group.ownerId === user.id;
  const [memberToRemove, setMemberToRemove] = useState<GroupMemberViewResponse | null>(null);

  const handleRemove = async () => {
    if (!memberToRemove) return;
    try {
      await removeMember.mutateAsync(memberToRemove.userId);
      haptics.success();
      toast.saved('Участник удалён из группы');
    } catch (error) {
      haptics.error();
      toast.error(
        isApiError(error)
          ? error.code === 'DOMAIN_RULE_VIOLATION'
            ? 'Сначала удалите сборы, где этот человек плательщик'
            : error.message
          : 'Не удалось удалить участника',
      );
    } finally {
      setMemberToRemove(null);
    }
  };

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
      refreshing={refreshing && !isLoading}
      headerAction={<RefreshIconButton refreshing={refreshing} onRefresh={() => void refresh()} />}
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
            <Button variant="secondary" loading={refreshing} onClick={() => void refresh()}>
              Повторить
            </Button>
          }
        />
      ) : !members.length ? (
        <Stack gap={4}>
          <InviteLinkButton
            link={inviteLink.data}
            isLoading={inviteLink.isLoading}
            isError={inviteLink.isError}
          />
          <EmptyState title="Пока нет участников" description="Отправьте пригласительную ссылку друзьям." />
        </Stack>
      ) : (
        <Stack gap={4}>
          <InviteLinkButton
            link={inviteLink.data}
            isLoading={inviteLink.isLoading}
            isError={inviteLink.isError}
          />
          <div className={css.membersList} role="list">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                onRemove={
                  isOwner && member.role !== 'OWNER'
                    ? (next) => {
                        haptics.tap();
                        setMemberToRemove(next);
                      }
                    : undefined
                }
              />
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

      <Sheet
        open={memberToRemove != null}
        onOpenChange={(open) => {
          if (!open) setMemberToRemove(null);
        }}
        title="Удалить из группы?"
        description={
          memberToRemove
            ? `${memberDisplayLabel(memberToRemove.displayName, memberToRemove.telegramUsername)} выйдет из группы и из всех её сборов.`
            : undefined
        }
      >
        <Stack gap={3}>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            loading={removeMember.isPending}
            onClick={() => void handleRemove()}
          >
            Да, удалить
          </Button>
          <Button type="button" fullWidth onClick={() => setMemberToRemove(null)}>
            Отмена
          </Button>
        </Stack>
      </Sheet>
    </Screen>
  );
}
