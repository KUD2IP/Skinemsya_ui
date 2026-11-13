import type { ReactNode } from 'react';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { PencilSimple, SignOut, Trash, UserPlus } from '@phosphor-icons/react';
import { groupKeys, useDeleteGroup, useGroupQuery, useLeaveGroup } from '../api/queries';
import { eventKeys } from '@/features/events/api/queries';
import { LEAVE_BLOCKED_BY_TRANSFER } from '@/features/events/model/eventRoster';
import { useProfileQuery } from '@/features/profile/api/queries';
import { AddMemberSheet } from './AddMemberSheet';
import { EditGroupSheet } from './EditGroupSheet';
import { GroupMembersPreview } from './GroupMembersPreview';
import { GroupDetailSkeleton } from './GroupDetailSkeleton';
import * as css from './GroupsScreen.css';
import { isApiError } from '@/shared/api';
import {
  Button,
  EmptyState,
  Icon,
  RefreshIconButton,
  Screen,
  ScreenBack,
  Sheet,
  Stack,
  toast,
} from '@/shared/ui';
import { groupTypeLabel, haptics, useScreenRefresh } from '@/shared/lib';

interface GroupDetailScreenProps {
  groupId: number;
  eventsSection: ReactNode;
  onCreateEvent: () => void;
}

function leaveGroupError(error: unknown): string {
  if (!isApiError(error)) return 'Не удалось выйти из группы';
  const message = error.message.toLowerCase();
  if (message.includes('владел') || message.includes('owner')) return 'Владелец не может выйти из группы';
  if (
    message.includes('отметили перевод') ||
    message.includes('waiting for payer confirmation') ||
    message.includes('open debt')
  ) {
    return LEAVE_BLOCKED_BY_TRANSFER;
  }
  if (message.includes('плательщик') || message.includes('payer')) {
    return 'Нельзя выйти из группы: вы плательщик в незакрытом сборе';
  }
  return error.message || 'Не удалось выйти из группы';
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
  const { data: group, isLoading, isError } = useGroupQuery(groupId);
  const { refresh, refreshing } = useScreenRefresh([
    groupKeys.detail(groupId),
    eventKeys.byGroup(groupId),
    groupKeys.members(groupId),
  ]);
  const deleteGroup = useDeleteGroup();
  const leaveGroup = useLeaveGroup();

  const [editing, setEditing] = useState(false);
  const [addingMember, setAddingMember] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  const isOwner = user != null && group != null && group.ownerId === user.id;
  const canLeave = user != null && group != null && !isOwner;
  const canAddMember = isOwner && group?.type === 'STANDALONE';

  const openSheet = (action: () => void) => {
    haptics.tap();
    action();
  };

  const handleLeave = async () => {
    try {
      await leaveGroup.mutateAsync(groupId);
      haptics.success();
      toast.saved('Вы вышли из группы');
      void navigate({ to: '/' });
    } catch (error) {
      haptics.error();
      const explanation = leaveGroupError(error);
      setLeaveError(explanation);
      toast.error(explanation);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteGroup.mutateAsync(groupId);
      haptics.success();
      toast.saved('Группа удалена');
      void navigate({ to: '/' });
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось удалить группу');
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <Screen
      title={group?.name ?? 'Группа'}
      subtitle={group ? groupSubtitle(group.type, isOwner) : undefined}
      refreshing={refreshing && !isLoading}
      headerLeading={<ScreenBack onBack={() => void navigate({ to: '/' })} />}
      headerAction={<RefreshIconButton refreshing={refreshing} onRefresh={() => void refresh()} />}
    >
      {isLoading ? (
        <GroupDetailSkeleton />
      ) : isError || !group ? (
        <EmptyState
          title="Группа не найдена"
          description="Возможно, у вас нет доступа или группа была удалена."
          actions={
            <Button variant="secondary" loading={refreshing} onClick={() => void refresh()}>
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
            ) : canLeave ? (
              <div className={css.dangerZone}>
                <Button
                  type="button"
                  variant="secondary"
                  fullWidth
                  leftIcon={<Icon icon={SignOut} size="sm" />}
                  onClick={() =>
                    openSheet(() => {
                      setLeaveError(null);
                      setConfirmLeave(true);
                    })
                  }
                >
                  Выйти из группы
                </Button>
              </div>
            ) : null}
          </Stack>

          <EditGroupSheet open={editing} onOpenChange={setEditing} group={group} />
          <AddMemberSheet open={addingMember} onOpenChange={setAddingMember} groupId={groupId} />

          <Sheet
            open={confirmLeave}
            onOpenChange={(open) => {
              setConfirmLeave(open);
              if (!open) setLeaveError(null);
            }}
            title="Выйти из группы?"
            description={
              leaveError ??
              'Вы выйдете из группы и из всех её сборов. Если вы уже отметили перевод, а плательщик его ещё не подтвердил, выйти нельзя.'
            }
          >
            <Stack gap={3}>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                loading={leaveGroup.isPending}
                onClick={() => void handleLeave()}
              >
                Да, выйти
              </Button>
              <Button type="button" fullWidth onClick={() => setConfirmLeave(false)}>
                Остаться
              </Button>
            </Stack>
          </Sheet>

          <Sheet
            open={confirmDelete}
            onOpenChange={setConfirmDelete}
            title="Удалить группу?"
            description="Вместе с группой удалятся все её сборы. Это нельзя отменить."
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
