import { useNavigate } from '@tanstack/react-router';
import type { DebtResponse, EventResponse } from '@/shared/api';
import { canReopenSelection } from './selectionSummary';

export function useSelectionReopen(
  eventId: number,
  groupId: number,
  eventStatus: EventResponse['status'],
  debts: DebtResponse[] | undefined,
) {
  const navigate = useNavigate();
  const canReopen = canReopenSelection(eventStatus, debts);

  const handleReopen = async () => {
    await navigate({
      to: '/groups/$groupId/events/$eventId',
      params: { groupId: String(groupId), eventId: String(eventId) },
      search: { edit: true },
    });
  };

  return { canReopen, handleReopen, isReopening: false };
}
