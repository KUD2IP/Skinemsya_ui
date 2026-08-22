import type { DebtResponse, EventResponse, PositionResponse } from '@/shared/api';

export interface SelectionSummaryItem {
  positionId: number;
  name: string;
  quantity: number;
  amountKopecks: number;
  shared: boolean;
}

/** Как на бэкенде: общие позиции делятся на N, невзятые порции не размазываются. */
export function sharedShareKopecks(totalPriceKopecks: number, participantCount: number): number {
  const count = Math.max(Math.floor(participantCount), 1);
  return Math.trunc(totalPriceKopecks / count);
}

export function selectedShareKopecks(
  totalPriceKopecks: number,
  selectedQuantity: number,
  totalQuantity: number,
): number {
  const totalUnits = Math.floor(totalQuantity);
  const selectedUnits = Math.floor(selectedQuantity);
  if (totalUnits <= 0 || selectedUnits <= 0) return 0;
  if (selectedUnits >= totalUnits) return totalPriceKopecks;
  return Math.trunc((totalPriceKopecks * selectedUnits) / totalUnits);
}

export function leftoverQuantity(position: PositionResponse): number {
  if (position.shared) return 0;
  const total = Math.floor(position.quantity);
  const claimed = (position.selectedBy ?? []).reduce((sum, selector) => sum + selector.quantity, 0);
  return Math.max(0, total - claimed);
}

export function quantityForUser(
  position: PositionResponse,
  userId: number,
  currentUserId?: number,
): number {
  const fromList = position.selectedBy?.find((selector) => selector.userId === userId)?.quantity;
  if (fromList != null) return fromList;
  if (currentUserId != null && userId === currentUserId) {
    return position.mySelectedQuantity ?? 0;
  }
  return 0;
}

export function selectionItemsForUser(
  positions: PositionResponse[] | undefined,
  userId: number | undefined,
  participantCount: number,
  currentUserId?: number,
  payerId?: number,
): SelectionSummaryItem[] {
  if (!positions?.length || userId == null) return [];
  const count = Math.max(participantCount, 1);
  const items: SelectionSummaryItem[] = [];

  for (const position of positions) {
    if (position.shared) {
      items.push({
        positionId: position.id,
        name: position.name,
        quantity: 1,
        amountKopecks: sharedShareKopecks(position.totalPriceKopecks, count),
        shared: true,
      });
      continue;
    }
    let quantity = quantityForUser(position, userId, currentUserId);
    if (payerId != null && userId === payerId) {
      quantity += leftoverQuantity(position);
    }
    if (quantity <= 0) continue;
    items.push({
      positionId: position.id,
      name: position.name,
      quantity,
      amountKopecks: selectedShareKopecks(position.totalPriceKopecks, quantity, position.quantity),
      shared: false,
    });
  }

  return items;
}

export function canReopenSelection(
  eventStatus: EventResponse['status'],
  debts: DebtResponse[] | undefined,
): boolean {
  if (eventStatus !== 'DISTRIBUTION' && eventStatus !== 'CALCULATED') {
    return false;
  }
  return !(debts ?? []).some(
    (debt) => debt.status === 'PENDING_CONFIRMATION' || debt.status === 'PAID',
  );
}
