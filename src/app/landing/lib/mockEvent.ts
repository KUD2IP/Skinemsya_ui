import type { DebtResponse, EventResponse, PositionResponse } from '@/shared/api';
import { DINNER, DINNER_ITEMS, DINNER_TRANSFERS } from './storyData';

const NOW = '2025-01-01T00:00:00.000Z';

export const MOCK_IDS = {
  groupId: 1,
  eventId: 101,
  mark: 1,
  anya: 2,
  borya: 3,
  kira: 4,
} as const;

function positionFromItem(
  item: (typeof DINNER_ITEMS)[number],
  id: number,
  extra?: Partial<PositionResponse>,
): PositionResponse {
  return {
    id,
    eventId: MOCK_IDS.eventId,
    receiptId: 1,
    name: item.name,
    quantity: item.qty,
    totalPriceKopecks: item.total,
    shared: Boolean(item.shared),
    tips: false,
    lowConfidence: false,
    source: 'RECEIPT',
    createdAt: NOW,
    ...extra,
  };
}

export function mockEvent(status: EventResponse['status']): EventResponse {
  return {
    id: MOCK_IDS.eventId,
    groupId: MOCK_IDS.groupId,
    name: DINNER.title,
    description: null,
    payerId: MOCK_IDS.mark,
    createdBy: MOCK_IDS.mark,
    status,
    payerRequisitesReady: true,
    expectedParticipantCount: DINNER.guests,
    joinedCount: DINNER.guests,
    currentUserJoined: true,
    createdAt: NOW,
    updatedAt: NOW,
  };
}

/** Позиции после загрузки чека (DRAFT). */
export const MOCK_POSITIONS_DRAFT: PositionResponse[] = DINNER_ITEMS.slice(0, 3).map((item, i) =>
  positionFromItem(item, i + 1),
);

/** Экран выбора: невзятые / взятые порции как в EventSelectionScreen. */
export const MOCK_POSITIONS_PICKS: PositionResponse[] = [
  positionFromItem(DINNER_ITEMS[0], 1, {
    remainingQuantity: 0,
    mySelectedQuantity: 2,
    selectedBy: [{ userId: MOCK_IDS.anya, quantity: 2 }],
  }),
  positionFromItem(DINNER_ITEMS[3], 4, {
    remainingQuantity: 1,
    mySelectedQuantity: 1,
    selectedBy: [{ userId: MOCK_IDS.anya, quantity: 1 }],
  }),
  positionFromItem(DINNER_ITEMS[2], 3, {
    remainingQuantity: 0,
    mySelectedQuantity: 0,
    soldOut: true,
    selectedBy: [
      { userId: MOCK_IDS.mark, quantity: 1 },
    ],
  }),
  positionFromItem(DINNER_ITEMS[6], 7, { shared: true }),
];

export const MOCK_DEBTS_PAYER: DebtResponse[] = DINNER_TRANSFERS.map((share, index) => {
  const debtorId =
    share.name === 'Аня'
      ? MOCK_IDS.anya
      : share.name === 'Боря'
        ? MOCK_IDS.borya
        : MOCK_IDS.kira;
  const status =
    share.name === 'Аня'
      ? 'PENDING_CONFIRMATION'
      : share.name === 'Кира'
        ? 'PAID'
        : 'UNPAID';
  return {
    id: index + 1,
    eventId: MOCK_IDS.eventId,
    debtorId,
    creditorId: MOCK_IDS.mark,
    amountKopecks: share.amount,
    status,
    paymentStatus: share.name === 'Аня' ? 'DEBTOR_CONFIRMED' : null,
    screenshotFileId: null,
    createdAt: NOW,
    updatedAt: NOW,
  };
});

export const MOCK_ANYA_SELECTION = [
  { positionId: 1, name: 'Калифорния', quantity: 2, amountKopecks: 84_000, shared: false },
  { positionId: 4, name: 'Гёдза', quantity: 1, amountKopecks: 34_000, shared: false },
  { positionId: 7, name: 'Зелёный чай', quantity: 1, amountKopecks: 12_000, shared: true },
];
