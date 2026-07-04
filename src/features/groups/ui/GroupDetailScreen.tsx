import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CaretLeft, PencilSimple, Trash, UserPlus } from '@phosphor-icons/react';
import { useDeleteGroup, useGroupQuery } from '../api/queries';
import { useProfileQuery } from '@/features/profile/api/queries';
import { AddMemberSheet } from './AddMemberSheet';
import { EditGroupSheet } from './EditGroupSheet';
import { GroupMembersPreview } from './GroupMembersPreview';
import { GroupsSkeleton } from './GroupsSkeleton';
import * as css from './GroupsScreen.css';
import { isApiError } from '@/shared/api';
import {
  Button,
  EmptyState,
  Icon,
  IconButton,
  Screen,
  Sheet,
  Stack,
  toast,
} from '@/shared/ui';
import { groupTypeLabel, haptics } from '@/shared/lib';

interface GroupDetailScreenProps {
  groupId: number;
  eventsSection: ReactNode;
  onCreateEvent: () => void;
}

function groupSubtitle(groupType: 'CHAT_LINKED' | 'STANDALONE', isOwner: boolean): string {
  const parts = [groupTypeLabel(groupType)];
  if (isOwner) parts.push('Вы владелец');
  return parts.join(' · ');
}

export function GroupDetailScreen({
  groupId,
  eventsSection,
  onCreateEvent,
}: GroupDetailScreenProps) {
  const navigate = useNavigate();
  const { data: user } = useProfileQuery();
  const { data: group, isLoading, isError, refetch } = useGroupQuery(groupId);
  const deleteGroup = useDeleteGroup();

  const [editing, setEditing] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isOwner = user != null && group ? group.ownerId === user.id : false;
  const canAddMember = isOwner && group?.type === 'STANDALONE';

  const openSheet = (action: () => void) => {
    haptics.tap();
    action();
  };

  const handleDelete = async () => {
    try {
      await deleteGroup.mutateAsync(groupId);
      haptics.success();
      toast.saved('Группа удалена');
      void navigate({ to: '/' });
    } catch (error) {
      haptics.error();
      toast.error(
        isApiError(error)
          ? error.code === 'DOMAIN_RULE_VIOLATION'
            ? `${error.message} Удалите сборы не в черновике или завершите их.`
            : error.message
          : 'Не удалось удалить группу',
      );
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <Screen
      title={group?.name ?? 'Группа'}
      subtitle={group ? groupSubtitle(group.type, isOwner) : undefined}
      headerLeading={
        <IconButton aria-label="Назад" onClick={() => void navigate({ to: '/' })}>
          <Icon icon={CaretLeft} weight="bold" />
        </IconButton>
      }
    >
      {isLoading ? (
        <GroupsSkeleton />
      ) : isError || !group ? (
        <EmptyState
          title="Группа не найдена"
          description="Возможно, у вас нет доступа или группа была удалена."
          actions={
            <Button variant="secondary" onClick={() => void refetch()}>
              Повторить
            </Button>
          }
        />
      ) : (
        <>
          <Stack gap={6}>
            <div className={css.actionsRow}>
              {isOwner ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Icon icon={PencilSimple} size="sm" />}
                  onClick={() => openSheet(() => setEditing(true))}
                >
                  Переименовать
                </Button>
              ) : null}
              {canAddMember ? (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  leftIcon={<Icon icon={UserPlus} size="sm" />}
                  onClick={() => openSheet(() => setAddingMember(true))}
                >
                  Участник
                </Button>
              ) : null}
              <Button type="button" size="sm" onClick={() => openSheet(onCreateEvent)}>
                Новый сбор
              </Button>
            </div>

            <GroupMembersPreview groupId={groupId} groupType={group.type} />

            {eventsSection}

            {isOwner ? (
              <div className={css.dangerZone}>
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  leftIcon={<Icon icon={Trash} size="sm" />}
                  onClick={() => openSheet(() => setConfirmDelete(true))}
                >
                  Удалить группу
                </Button>
              </div>
            ) : null}
          </Stack>

          <EditGroupSheet open={editing} onOpenChange={setEditing} group={group} />
          <AddMemberSheet open={addingMember} onOpenChange={setAddingMember} groupId={groupId} />

          <Sheet
            open={confirmDelete}
            onOpenChange={setConfirmDelete}
            title="Удалить группу?"
            description="Нельзя удалить группу, пока есть сборы не в статусе «Черновик». Удалите или завершите их, либо удалите черновики."
          >
            <Stack gap={3}>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                loading={deleteGroup.isPending}
                onClick={() => void handleDelete()}
              >
                Да, удалить
              </Button>
              <Button type="button" fullWidth onClick={() => setConfirmDelete(false)}>
                Отмена
              </Button>
            </Stack>
          </Sheet>
        </>
      )}
    </Screen>
  );
}
