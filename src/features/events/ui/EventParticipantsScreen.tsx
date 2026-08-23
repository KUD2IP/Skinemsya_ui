import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CaretLeft, Trash } from '@phosphor-icons/react';
import { debtKeys, useParticipantsStatusQuery } from '@/features/debts';
import { groupKeys, useGroupMembersQuery, useGroupQuery } from '@/features/groups/api/queries';
import { InviteLinkButton } from '@/features/groups/ui/InviteLinkButton';
import * as membersCss from '@/features/groups/ui/GroupMembers.css';
import { isApiError } from '@/shared/api';
import {
  Avatar,
  Button,
  EmptyState,
  FieldGroup,
  Icon,
  IconButton,
  RefreshIconButton,
  Screen,
  Sheet,
  Skeleton,
  Stack,
  toast,
} from '@/shared/ui';
import { avatarToneFromSeed, formatTelegramUsername, haptics, memberDisplayLabel, useScreenRefresh } from '@/shared/lib';
import {
  eventKeys,
  useEventInviteLinkQuery,
  useEventQuery,
  useLeaveEvent,
  useRemoveEventParticipant,
  useUpdateExpectedParticipants,
} from '../api/queries';
import {
  canChangeExpectedCount,
  canLeaveEvent,
  canRemoveEventParticipant,
  eventCapacityLabel,
} from '../model/eventRoster';
import { CountField } from './CountField';

interface EventParticipantsScreenProps {
  groupId: number;
  eventId: number;
  currentUserId?: number;
}

export function EventParticipantsScreen({
  groupId,
  eventId,
  currentUserId,
}: EventParticipantsScreenProps) {
  const navigate = useNavigate();
  const { data: event, isLoading: eventLoading, isError: eventError } =
    useEventQuery(eventId);
  const { data: status, isLoading: statusLoading, isError: statusError } =
    useParticipantsStatusQuery(eventId, event?.currentUserJoined === true);
  const { refresh, refreshing } = useScreenRefresh([
    eventKeys.detail(eventId),
    debtKeys.participants(eventId),
    groupKeys.members(groupId),
    groupKeys.detail(groupId),
  ]);
  const { data: members } = useGroupMembersQuery(groupId);
  const { data: group } = useGroupQuery(groupId);
  const leave = useLeaveEvent(eventId, groupId);
  const inviteLink = useEventInviteLinkQuery(eventId);
  const removeParticipant = useRemoveEventParticipant(eventId, groupId);
  const updateCount = useUpdateExpectedParticipants(eventId, groupId);
  const [editingCount, setEditingCount] = useState(false);
  const [countDraft, setCountDraft] = useState<number | ''>('');
  const [userToRemove, setUserToRemove] = useState<number | null>(null);

  const memberMap = useMemo(
    () => new Map((members ?? []).map((member) => [member.userId, member])),
    [members],
  );

  const people = status?.participants ?? [];
  const canLeave = event ? canLeaveEvent(event, currentUserId) : false;
  const canEditCount = event ? canChangeExpectedCount(event, currentUserId) : false;
  const minCount = Math.max(2, event?.joinedCount ?? 2);

  const openCountEditor = () => {
    if (!event) return;
    setCountDraft(event.expectedParticipantCount);
    setEditingCount(true);
  };

  const handleSaveCount = async () => {
    if (countDraft === '' || typeof countDraft !== 'number') {
      toast.error('Укажите число');
      return;
    }
    try {
      await updateCount.mutateAsync({ expectedParticipantCount: countDraft });
      haptics.success();
      toast.success('Количество обновлено');
      setEditingCount(false);
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось изменить количество');
    }
  };

  const handleLeave = async () => {
    try {
      await leave.mutateAsync();
      haptics.success();
      await navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } });
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось выйти из сбора');
    }
  };

  const handleRemove = async () => {
    if (userToRemove == null) return;
    try {
      await removeParticipant.mutateAsync(userToRemove);
      haptics.success();
      toast.saved('Участник удалён из сбора');
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось удалить участника');
    } finally {
      setUserToRemove(null);
    }
  };

  const personLabel = (userId: number) => {
    if (userId === currentUserId) return 'Вы';
    const member = memberMap.get(userId);
    return member
      ? memberDisplayLabel(member.displayName, member.telegramUsername)
      : `Участник #${userId}`;
  };

  const personUsername = (userId: number) => {
    const member = memberMap.get(userId);
    return member?.telegramUsername ? formatTelegramUsername(member.telegramUsername) : null;
  };

  const personRole = (userId: number) => {
    if (!event) return null;
    if (userId === event.payerId) return 'Плательщик';
    if (userId === event.createdBy) return 'Создатель';
    return null;
  };

  const isLoading = eventLoading || statusLoading;
  const isError = eventError || statusError;

  return (
    <Screen
      title="Участники"
      subtitle={event ? eventCapacityLabel(event) : undefined}
      headerLeading={
        <IconButton
          aria-label="Назад"
          onClick={() =>
            void navigate({
              to: '/groups/$groupId/events/$eventId',
              params: { groupId: String(groupId), eventId: String(eventId) },
            })
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
          <Skeleton className={membersCss.rowSkeleton} radius="md" />
          <Skeleton className={membersCss.rowSkeleton} radius="md" />
        </Stack>
      ) : isError || !event ? (
        <EmptyState
          title="Не удалось загрузить участников"
          actions={
            <Button variant="secondary" loading={refreshing} onClick={() => void refresh()}>
              Повторить
            </Button>
          }
        />
      ) : (
        <Stack gap={5}>
          <InviteLinkButton
            link={inviteLink.data}
            isLoading={inviteLink.isLoading}
            isError={inviteLink.isError}
          />
          {canEditCount ? (
            <Button type="button" variant="secondary" onClick={openCountEditor}>
              Изменить количество
            </Button>
          ) : null}

          <div className={membersCss.membersList} role="list">
            {people.map((person) => {
              const role = personRole(person.userId);
              const username = personUsername(person.userId);
              return (
                <div key={person.userId} className={membersCss.memberRow} role="listitem">
                  <Avatar
                    name={personLabel(person.userId)}
                    size="md"
                    tone={avatarToneFromSeed(String(person.userId))}
                  />
                  <span className={membersCss.memberBody}>
                    <span className={membersCss.memberName}>{personLabel(person.userId)}</span>
                    {username ? <span className={membersCss.memberUsername}>{username}</span> : null}
                  </span>
                  {role ? <span className={membersCss.rolePill}>{role}</span> : null}
                  {canRemoveEventParticipant(event, person.userId, currentUserId, group?.ownerId) ? (
                    <IconButton
                      variant="bare"
                      aria-label={`Удалить ${personLabel(person.userId)}`}
                      onClick={() => {
                        haptics.tap();
                        setUserToRemove(person.userId);
                      }}
                    >
                      <Icon icon={Trash} size="sm" />
                    </IconButton>
                  ) : null}
                </div>
              );
            })}
          </div>

          {canLeave ? (
            <Button
              type="button"
              variant="secondary"
              loading={leave.isPending}
              onClick={() => void handleLeave()}
            >
              Выйти из сбора
            </Button>
          ) : null}
        </Stack>
      )}

      <Sheet
        open={userToRemove != null}
        onOpenChange={(open) => {
          if (!open) setUserToRemove(null);
        }}
        title="Удалить из сбора?"
        description={
          userToRemove != null
            ? `${personLabel(userToRemove)} больше не будет в этом сборе.`
            : undefined
        }
      >
        <Stack gap={3}>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            loading={removeParticipant.isPending}
            onClick={() => void handleRemove()}
          >
            Да, удалить
          </Button>
          <Button type="button" fullWidth onClick={() => setUserToRemove(null)}>
            Отмена
          </Button>
        </Stack>
      </Sheet>

      <Sheet open={editingCount} onOpenChange={setEditingCount} title="Сколько человек">
        <Stack gap={6}>
          <FieldGroup
            label="Было за столом"
            hint={`Не меньше уже вошедших (${minCount})`}
          >
            <CountField
              value={countDraft}
              min={minCount}
              max={99}
              onChange={setCountDraft}
            />
          </FieldGroup>
          <Button
            type="button"
            fullWidth
            loading={updateCount.isPending}
            onClick={() => void handleSaveCount()}
          >
            Сохранить
          </Button>
        </Stack>
      </Sheet>
    </Screen>
  );
}
