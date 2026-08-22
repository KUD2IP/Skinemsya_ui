import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Trash } from '@phosphor-icons/react';
import { useGroupQuery } from '@/features/groups/api/queries';
import { isApiError } from '@/shared/api';
import type { EventResponse } from '@/shared/api';
import { haptics } from '@/shared/lib';
import { Button, Icon, Sheet, Stack, toast } from '@/shared/ui';
import { useDeleteEvent } from '../api/queries';
import { canDeleteEvent } from '../model/eventRoster';

interface DeleteEventControlProps {
  groupId: number;
  event: EventResponse;
  currentUserId?: number;
}

export function DeleteEventControl({
  groupId,
  event,
  currentUserId,
}: DeleteEventControlProps) {
  const navigate = useNavigate();
  const { data: group } = useGroupQuery(groupId);
  const deleteEvent = useDeleteEvent(groupId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!canDeleteEvent(event, currentUserId, group?.ownerId)) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await deleteEvent.mutateAsync(event.id);
      haptics.success();
      toast.saved('Сбор удалён');
      void navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } });
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось удалить сбор');
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        fullWidth
        leftIcon={<Icon icon={Trash} size="sm" />}
        onClick={() => {
          haptics.tap();
          setConfirmDelete(true);
        }}
      >
        Удалить сбор
      </Button>
      <Sheet
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Удалить сбор?"
        description="Сбор исчезнет у всех участников. Это нельзя отменить."
      >
        <Stack gap={3}>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            loading={deleteEvent.isPending}
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
  );
}
