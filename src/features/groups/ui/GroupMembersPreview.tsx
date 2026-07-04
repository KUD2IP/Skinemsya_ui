import { UsersThree } from '@phosphor-icons/react';
import { useNavigate } from '@tanstack/react-router';
import { flattenPageItems, useGroupMembersInfiniteQuery } from '../api/queries';
import * as css from './GroupMembers.css';
import * as screenCss from './GroupsScreen.css';
import type { GroupType } from '@/shared/api';
import { EmptyState, Icon, Skeleton, Stack } from '@/shared/ui';
import { haptics } from '@/shared/lib';

interface GroupMembersPreviewProps {
  groupId: number;
  groupType: GroupType;
}

function membersLabel(count: number): string {
  if (count === 1) return '1 участник';
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) {
    return `${count} участника`;
  }
  return `${count} участников`;
}

export function GroupMembersPreview({ groupId, groupType }: GroupMembersPreviewProps) {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGroupMembersInfiniteQuery(groupId);
  const members = flattenPageItems(data?.pages);
  const total = data?.pages[0]?.totalElements ?? members.length;

  const openMembers = () => {
    haptics.tap();
    void navigate({
      to: '/groups/$groupId/members',
      params: { groupId: String(groupId) },
    });
  };

  return (
    <Stack gap={2}>
      <span className={screenCss.sectionLabel}>Участники</span>
      {groupType === 'CHAT_LINKED' ? (
        <span className={css.chatHint}>
          Участники добавляются, когда человек открывает приложение из чата.
        </span>
      ) : null}

      {isLoading ? (
        <Skeleton height={44} radius="lg" />
      ) : isError ? (
        <EmptyState title="Не удалось загрузить участников" description="Попробуйте обновить страницу." />
      ) : !members.length ? (
        <EmptyState title="Пока один участник" description="Добавьте друзей по @username." />
      ) : (
        <div className={css.listPanel}>
          <button type="button" className={css.previewRow} onClick={openMembers}>
            <span className={css.previewIcon} aria-hidden>
              <Icon icon={UsersThree} size="sm" />
            </span>
            <span className={css.previewTitle}>{membersLabel(total)}</span>
          </button>
        </div>
      )}
    </Stack>
  );
}
