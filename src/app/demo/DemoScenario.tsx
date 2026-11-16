import { CaretRight, Copy, UsersThree } from '@phosphor-icons/react';
import { eventCapacityLabel } from '@/features/events/model/eventRoster';
import * as capacityCss from '@/features/events/ui/EventCapacityBar.css';
import * as payerCss from '@/features/debts/ui/PayerDashboardScreen.css';
import {
  AddManualButton,
  PositionCard,
  ReceiptUploadButton,
} from '@/features/positions/ui/PositionCard';
import * as positionsCss from '@/features/positions/ui/EventPositionsScreen.css';
import { preferredBankLabel } from '@/features/profile/model/banks';
import * as paymentCss from '@/features/payments/ui/PaymentScreen.css';
import { sharedShareKopecks } from '@/features/selections/model/selectionSummary';
import { SelectionSummary } from '@/features/selections/ui/SelectionSummary';
import * as selectionCss from '@/features/selections/ui/EventSelectionScreen.css';
import type { DebtStatus, EventResponse, PositionResponse } from '@/shared/api';
import {
  debtStatusLabel,
  formatMoney,
  formatPhone,
  paymentStatusLabel,
  positionUnitPriceKopecks,
} from '@/shared/lib';
import { Badge, Button, Icon, IconButton, Stack } from '@/shared/ui';
import { DINNER, DINNER_TRANSFERS } from '../landing/lib/storyData';
import {
  MOCK_ANYA_SELECTION,
  MOCK_DEBTS_PAYER,
  MOCK_POSITIONS_DRAFT,
  MOCK_POSITIONS_PICKS,
  mockEvent,
} from '../landing/lib/mockEvent';
import * as css from './DemoScenario.css';

export type DemoScenarioVariant = 'positions' | 'picks' | 'payer' | 'pay';

const ANYA_TOTAL = 148_000;
const noop = () => undefined;

function isSoldOut(position: PositionResponse): boolean {
  if (position.soldOut != null) return position.soldOut;
  const remaining = position.remainingQuantity ?? 0;
  const mine = position.mySelectedQuantity ?? 0;
  return remaining <= 0 && mine <= 0;
}

function payerBadgeTone(status: DebtStatus): 'neutral' | 'warning' | 'success' {
  if (status === 'PAID') return 'success';
  if (status === 'PENDING_CONFIRMATION') return 'warning';
  return 'neutral';
}

function payerStatusLabel(name: string, status: DebtStatus): string {
  if (name === 'Аня' && status === 'PENDING_CONFIRMATION') {
    return paymentStatusLabel('DEBTOR_CONFIRMED');
  }
  return debtStatusLabel(status);
}

function DemoCapacity({ event }: { event: EventResponse }) {
  return (
    <div className={capacityCss.panel}>
      <div className={capacityCss.previewRow}>
        <span className={capacityCss.previewIcon} aria-hidden>
          <Icon icon={UsersThree} size="sm" />
        </span>
        <span className={capacityCss.previewTitle}>Участники</span>
        <span className={capacityCss.previewMeta}>{eventCapacityLabel(event)}</span>
      </div>
    </div>
  );
}

function PositionsScenario({ onAdvance }: { onAdvance: () => void }) {
  const event = mockEvent('DRAFT');
  const total = MOCK_POSITIONS_DRAFT.reduce((sum, position) => sum + position.totalPriceKopecks, 0);

  return (
    <div className={css.scenario}>
      <DemoCapacity event={event} />
      <div className={positionsCss.uploadRow}>
        <ReceiptUploadButton onFileSelected={noop} />
        <AddManualButton onClick={noop} />
      </div>
      <p className={positionsCss.bannerInfo}>Позиции добавлены из чека</p>
      <Stack gap={3}>
        {MOCK_POSITIONS_DRAFT.map((position) => (
          <PositionCard
            key={position.id}
            position={position}
            onEdit={noop}
            onMarkShared={noop}
            onUnmarkShared={noop}
            onDelete={noop}
          />
        ))}
      </Stack>
      <div className={css.dockedFooter}>
        <div className={positionsCss.footerPreview}>
          <span>{event.joinedCount}/{event.expectedParticipantCount} в сборе</span>
          <span className={positionsCss.footerTotal}>Итого: {formatMoney(total)}</span>
        </div>
        <Button type="button" fullWidth onClick={onAdvance}>
          Запустить сбор
        </Button>
      </div>
    </div>
  );
}

function PicksScenario({ onAdvance }: { onAdvance: () => void }) {
  const event = mockEvent('DISTRIBUTION');
  const nonShared = MOCK_POSITIONS_PICKS.filter((position) => !position.shared);
  const shared = MOCK_POSITIONS_PICKS.filter((position) => position.shared);
  const participantCount = event.expectedParticipantCount;

  return (
    <div className={css.scenario}>
      <DemoCapacity event={event} />
      {nonShared.map((position) => {
        const quantity = position.mySelectedQuantity ?? 0;
        const max = position.remainingQuantity ?? 0;
        const soldOut = isSoldOut(position);
        const totalUnits = Math.floor(position.quantity);
        const leftoverHint = soldOut ? 'разобрали' : `осталось ${max} из ${totalUnits}`;
        return (
          <div
            key={position.id}
            className={soldOut ? `${selectionCss.row} ${selectionCss.rowSoldOut}` : selectionCss.row}
          >
            <div className={selectionCss.rowTop}>
              <span className={soldOut ? selectionCss.nameSoldOut : selectionCss.name}>
                {position.name}
              </span>
              <span className={selectionCss.price}>{formatMoney(position.totalPriceKopecks)}</span>
            </div>
            <div className={selectionCss.rowBottom}>
              <span className={selectionCss.meta}>
                {formatMoney(positionUnitPriceKopecks(position))}/шт · {leftoverHint}
              </span>
              {!soldOut ? (
                <div className={selectionCss.qtyStepper} aria-label={`Выбрано: ${quantity}`}>
                  <span className={selectionCss.qtyBtn} aria-hidden>−</span>
                  <span className={selectionCss.qtyValue}>{quantity}</span>
                  <span className={selectionCss.qtyBtn} aria-hidden>+</span>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
      {shared.length > 0 ? (
        <Stack gap={3}>
          <span className={selectionCss.meta}>На всех — делятся автоматически</span>
          {shared.map((position) => (
            <div key={position.id} className={selectionCss.row}>
              <div className={selectionCss.rowTop}>
                <span className={selectionCss.name}>{position.name}</span>
                <span className={selectionCss.price}>{formatMoney(position.totalPriceKopecks)}</span>
              </div>
              <div className={selectionCss.rowBottom}>
                <span className={selectionCss.meta}>
                  {formatMoney(sharedShareKopecks(position.totalPriceKopecks, participantCount))} с вас
                </span>
              </div>
            </div>
          ))}
        </Stack>
      ) : null}
      <div className={css.dockedFooter}>
        <div className={selectionCss.footerSum}>
          <span>Твоя сумма</span>
          <span className={selectionCss.footerAmount}>{formatMoney(ANYA_TOTAL)}</span>
        </div>
        <Button type="button" fullWidth onClick={onAdvance}>
          Скинуть {formatMoney(ANYA_TOTAL)}
        </Button>
      </div>
    </div>
  );
}

function PayScenario({ onAdvance }: { onAdvance: () => void }) {
  const event = mockEvent('CALCULATED');

  return (
    <Stack gap={6}>
      <DemoCapacity event={event} />
      <div className={paymentCss.amountBlock}>
        <span className={paymentCss.amountLabel}>К переводу</span>
        <span className={paymentCss.amountValue}>{formatMoney(ANYA_TOTAL)}</span>
      </div>
      <div className={paymentCss.detailsCard}>
        <Stack gap={3}>
          <span className={paymentCss.creditorName}>{DINNER.payer}</span>
          <div className={paymentCss.detailRow}>
            <Stack gap={1} flex={1}>
              <span className={paymentCss.detailLabel}>Банк</span>
              <p className={paymentCss.detailsText}>{preferredBankLabel('sber')}</p>
            </Stack>
          </div>
          <div className={paymentCss.detailRow}>
            <Stack gap={1} flex={1}>
              <span className={paymentCss.detailLabel}>Телефон для СБП</span>
              <p className={paymentCss.detailsText}>{formatPhone('+79001234567')}</p>
            </Stack>
            <IconButton variant="bare" aria-label="Скопировать телефон" tabIndex={-1} onClick={noop}>
              <Icon icon={Copy} size="sm" />
            </IconButton>
          </div>
        </Stack>
      </div>
      <p className={paymentCss.hint}>
        Переведи в банке и нажми «Отправил». Чек можно прикрепить, но это необязательно
      </p>
      <Button type="button" variant="secondary" fullWidth tabIndex={-1} onClick={noop}>
        Прикрепить чек перевода
      </Button>
      <Button type="button" fullWidth onClick={onAdvance}>
        Отправил
      </Button>
      <SelectionSummary title="Твои позиции" items={MOCK_ANYA_SELECTION} variant="plain" />
    </Stack>
  );
}

function PayerScenario() {
  const event = mockEvent('CALCULATED');

  return (
    <div className={payerCss.body}>
      <DemoCapacity event={event} />
      <Stack gap={2}>
        <p className={payerCss.progress}>Проверь переводы участников</p>
        <p className={payerCss.progressMeta}>Подтверди получение или отметь проблему</p>
      </Stack>
      <div className={payerCss.toolbar}>
        <Button type="button" onClick={noop}>Всё на месте</Button>
        <Button type="button" variant="secondary" onClick={noop}>Напомнить</Button>
      </div>
      <Stack gap={3}>
        {DINNER_TRANSFERS.map((share) => {
          const debt = MOCK_DEBTS_PAYER.find((item) => item.amountKopecks === share.amount);
          const status = debt?.status ?? 'UNPAID';
          return (
            <div key={share.name} className={payerCss.participantRow}>
              <div className={payerCss.participantHeader}>
                <span className={css.iconSlot} aria-hidden>
                  <Icon icon={CaretRight} size="sm" />
                </span>
                <div className={payerCss.participantMain}>
                  <span className={payerCss.participantName}>{share.name}</span>
                  <span className={payerCss.participantAmount}>{formatMoney(share.amount)}</span>
                </div>
                <Badge tone={payerBadgeTone(status)}>{payerStatusLabel(share.name, status)}</Badge>
              </div>
            </div>
          );
        })}
      </Stack>
    </div>
  );
}

export interface DemoScenarioProps {
  variant: DemoScenarioVariant;
  onAdvance?: () => void;
}

export function DemoScenario({ variant, onAdvance = noop }: DemoScenarioProps) {
  if (variant === 'positions') return <PositionsScenario onAdvance={onAdvance} />;
  if (variant === 'picks') return <PicksScenario onAdvance={onAdvance} />;
  if (variant === 'pay') return <PayScenario onAdvance={onAdvance} />;
  return <PayerScenario />;
}
