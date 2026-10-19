import { isApiError, type EventResponse } from '@/shared/api';

export function eventCapacityLabel(event: EventResponse): string {
  return `${event.joinedCount}/${event.expectedParticipantCount}`;
}

export function canRevertToDraft(event: EventResponse, userId?: number): boolean {
  if (userId == null) return false;
  if (userId !== event.payerId && userId !== event.createdBy) return false;
  return event.status === 'DISTRIBUTION' || event.status === 'CALCULATED';
}

export const LEAVE_BLOCKED_BY_TRANSFER =
  'Нельзя выйти: вы уже отметили перевод, а плательщик его ещё не подтвердил';

export function leaveBlockedMessage(error: unknown, fallback: string): string {
  if (!isApiError(error)) return fallback;
  const message = error.message.toLowerCase();
  if (
    message.includes('отметили перевод') ||
    message.includes('waiting for payer confirmation') ||
    message.includes('open debt') ||
    error.code === 'DOMAIN_CONFLICT' ||
    message.includes('cannot leave this event')
  ) {
    return LEAVE_BLOCKED_BY_TRANSFER;
  }
  return error.message || fallback;
}

export function canLeaveEvent(event: EventResponse, userId?: number): boolean {
  if (userId == null || !event.currentUserJoined) return false;
  if (userId === event.payerId || userId === event.createdBy) return false;
  return event.status !== 'COMPLETED';
}

export function canJoinEvent(event: EventResponse): boolean {
  if (event.currentUserJoined) return false;
  if (event.status === 'COMPLETED') return false;
  return event.joinedCount < event.expectedParticipantCount;
}

export function canChangeExpectedCount(event: EventResponse, userId?: number): boolean {
  if (userId == null) return false;
  if (userId !== event.payerId && userId !== event.createdBy) return false;
  return event.status !== 'COMPLETED';
}

export function canDeleteEvent(
  event: EventResponse,
  userId?: number,
  groupOwnerId?: number,
): boolean {
  if (userId == null) return false;
  return userId === event.createdBy || userId === event.payerId || userId === groupOwnerId;
}

export function canRemoveEventParticipant(
  event: EventResponse,
  targetUserId: number,
  currentUserId?: number,
  groupOwnerId?: number,
): boolean {
  if (currentUserId == null || groupOwnerId == null) return false;
  if (currentUserId !== groupOwnerId) return false;
  if (targetUserId === event.payerId || targetUserId === event.createdBy) return false;
  return event.status !== 'COMPLETED';
}
