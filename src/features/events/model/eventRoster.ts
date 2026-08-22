import type { EventResponse } from '@/shared/api';

export function eventCapacityLabel(event: EventResponse): string {
  return `${event.joinedCount}/${event.expectedParticipantCount}`;
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
