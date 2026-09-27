import { CaretRight, Copy } from '@phosphor-icons/react';
import { LandingEventCapacity } from './LandingEventCapacity';
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
import type { DebtStatus, PositionResponse } from '@/shared/api';
import {
  debtStatusLabel,
  eventStatusLabel,
  formatMoney,
  formatPhone,
  paymentStatusLabel,
  positionUnitPriceKopecks,
} from '@/shared/lib';
import { Badge, Button, IconButton, Stack } from '@/shared/ui';
import { LandingIcon } from './LandingIcon';
import { DINNER, DINNER_TRANSFERS } from '../lib/storyData';
import {
  MOCK_ANYA_SELECTION,
  MOCK_DEBTS_PAYER,
  MOCK_POSITIONS_DRAFT,
  MOCK_POSITIONS_PICKS,
  mockEvent,
} from '../lib/mockEvent';
import { LandingDemoFrame } from './LandingDemoFrame';
import * as css from './LandingDemo.css';

export type LandingDemoVariant = 'positions' | 'picks' | 'payer' | 'pay';

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

function PositionsScreen() {
  const event = mockEvent('DRAFT');
  const total = MOCK_POSITIONS_DRAFT.reduce((sum, p) => sum + p.totalPriceKopecks, 0);

  return (
    <LandingDemoFrame title={event.name} subtitle={eventStatusLabel(event.status)}>
      <div className={css.scrollBody}>
        <LandingEventCapacity event={event} />
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
            <span>
              {event.joinedCount}/{event.expectedParticipantCount} в сборе
            </span>
            <span className={positionsCss.footerTotal}>Итого: {formatMoney(total)}</span>
          </div>
          <Button type="button" fullWidth tabIndex={-1} onClick={noop}>
            Запустить сбор
          </Button>
        </div>
      </div>
    </LandingDemoFrame>
  );
}

function PicksScreen() {
  const event = mockEvent('DISTRIBUTION');
  const nonShared = MOCK_POSITIONS_PICKS.filter((p) => !p.shared);
  const shared = MOCK_POSITIONS_PICKS.filter((p) => p.shared);
  const participantCount = event.expectedParticipantCount;

  return (
    <LandingDemoFrame title={event.name} subtitle={eventStatusLabel(event.status)}>
      <LandingEventCapacity event={event} />
      <div className={css.scrollBody}>
        {nonShared.map((position) => {
          const qty = position.mySelectedQuantity ?? 0;
          const max = position.remainingQuantity ?? 0;
          const soldOut = isSoldOut(position);
          const totalUnits = Math.floor(position.quantity);
          const leftoverHint = soldOut
            ? 'разобрали'
            : `осталось ${max} из ${totalUnits}`;
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
                  <div className={selectionCss.qtyStepper}>
                    <span className={selectionCss.qtyBtn} aria-hidden>−</span>
                    <span className={selectionCss.qtyValue}>{qty}</span>
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
                    {formatMoney(sharedShareKopecks(position.totalPriceKopecks, participantCount))} с
                    вас
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
          <Button type="button" fullWidth tabIndex={-1} onClick={noop}>
            Скинуть {formatMoney(ANYA_TOTAL)}
          </Button>
        </div>
      </div>
    </LandingDemoFrame>
  );
}

function PayerScreen() {
  const event = mockEvent('CALCULATED');

  return (
    <LandingDemoFrame title={event.name} subtitle={eventStatusLabel(event.status)}>
      <div className={payerCss.body}>
        <LandingEventCapacity event={event} />
        <Stack gap={2}>
          <p className={payerCss.progress}>Проверь переводы участников</p>
          <p className={payerCss.progressMeta}>Подтверди получение или отметь проблему</p>
        </Stack>
        <div className={payerCss.toolbar}>
          <Button type="button" tabIndex={-1} onClick={noop}>Всё на месте</Button>
          <Button type="button" variant="secondary" tabIndex={-1} onClick={noop}>
            Напомнить
          </Button>
        </div>
        <Stack gap={3}>
          {DINNER_TRANSFERS.map((share) => {
            const debt = MOCK_DEBTS_PAYER.find((d) => d.amountKopecks === share.amount);
            const status = debt?.status ?? 'UNPAID';
            return (
              <div key={share.name} className={payerCss.participantRow}>
                <button type="button" className={payerCss.participantHeader} tabIndex={-1}>
                  <span className={css.iconSlot}>
                    <LandingIcon icon={CaretRight} size="sm" weight="bold" />
                  </span>
                  <div className={payerCss.participantMain}>
                    <span className={payerCss.participantName}>{share.name}</span>
                    <span className={payerCss.participantAmount}>{formatMoney(share.amount)}</span>
                  </div>
                  <Badge tone={payerBadgeTone(status)}>{payerStatusLabel(share.name, status)}</Badge>
                </button>
              </div>
            );
          })}
        </Stack>
      </div>
    </LandingDemoFrame>
  );
}

function PayScreen() {
  const event = mockEvent('CALCULATED');

  return (
    <LandingDemoFrame title={event.name} subtitle="Скинуть">
      <Stack gap={6}>
        <LandingEventCapacity event={event} />
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
                <LandingIcon icon={Copy} size="sm" />
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
        <Button type="button" fullWidth tabIndex={-1} onClick={noop}>
          Отправил
        </Button>
        <SelectionSummary title="Твои позиции" items={MOCK_ANYA_SELECTION} variant="plain" />
      </Stack>
    </LandingDemoFrame>
  );
}

export interface LandingDemoProps {
  variant: LandingDemoVariant;
}

/** Статичные копии экранов Mini App — те же блоки и тексты, что в `features/*`. */
export function LandingDemo({ variant }: LandingDemoProps) {
  if (variant === 'positions') return <PositionsScreen />;
  if (variant === 'picks') return <PicksScreen />;
  if (variant === 'pay') return <PayScreen />;
  return <PayerScreen />;
}
