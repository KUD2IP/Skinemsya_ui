import { useEffect, useRef, useState } from 'react';
import { isApiError, type SubscriptionProvider, type SubscriptionResponse } from '@/shared/api';
import { formatMoney } from '@/shared/lib';
import { Button, Sheet, Stack } from '@/shared/ui';
import { useSubscriptionCheckout, useSubscriptionQuery } from '../api/queries';
import { openExternal, openInvoice } from '../lib/telegramPay';
import * as css from './ReceiptPaywallSheet.css';

const PAID_NOTE = 'Если оплата прошла, распознавание включится само через несколько секунд';

interface ReceiptPaywallSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onManual?: () => void;
  onActivated?: () => void;
  /** В профиле ручной ввод блюд не нужен, остаются только способы оплаты. */
  showManual?: boolean;
}

async function waitForActivation(
  refetch: () => Promise<{ data?: SubscriptionResponse }>,
  stillHere: () => boolean,
) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const result = await refetch();
    if (result.data?.active && result.data.currentPeriodEnd) return true;
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (!stillHere()) return false;
  }
  return false;
}

export function ReceiptPaywallSheet({
  open,
  onOpenChange,
  onManual,
  onActivated,
  showManual = true,
}: ReceiptPaywallSheetProps) {
  const subscription = useSubscriptionQuery();
  const checkout = useSubscriptionCheckout();
  const [note, setNote] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (open) setNote(null);
  }, [open]);

  const price = formatMoney(subscription.data?.priceKopecks ?? 4900);
  const cardAvailable = subscription.data?.yookassaAvailable === true;
  const starsAvailable = subscription.data?.starsAvailable === true;
  const primaryMethod: SubscriptionProvider | null = cardAvailable
    ? 'YOOKASSA'
    : starsAvailable
      ? 'STARS'
      : null;

  const finish = (paid: boolean) => {
    setWaiting(false);
    if (paid) {
      onOpenChange(false);
      onActivated?.();
      return;
    }
    if (alive.current) setNote(PAID_NOTE);
  };

  const pay = async (method: SubscriptionProvider) => {
    setWaiting(true);
    setNote(null);
    try {
      const result = await checkout.mutateAsync({ method });
      if (result.confirmationUrl) {
        openExternal(result.confirmationUrl);
        finish(await waitForActivation(() => subscription.refetch(), () => alive.current));
        return;
      }
      if (result.invoiceLink) {
        const status = await openInvoice(result.invoiceLink);
        if (status === 'cancelled') {
          setWaiting(false);
          return;
        }
        if (status === 'failed') setNote(PAID_NOTE);
        finish(await waitForActivation(() => subscription.refetch(), () => alive.current));
        return;
      }
      setWaiting(false);
      setNote(PAID_NOTE);
    } catch (error) {
      setWaiting(false);
      setNote(isApiError(error) ? error.message : 'Не удалось открыть оплату');
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) setWaiting(false);
        onOpenChange(next);
      }}
      title="Подписка"
      description="Нужна только для чтения фото. Блюда по-прежнему можно вписать вручную."
    >
      <Stack gap={3}>
        <p className={css.price}>{price}</p>
        <p className={css.note}>
          30 дней, затем спишется снова. Отмена в профиле.{' '}
          <a className={css.offerLink} href="/legal">
            Оферта и реквизиты
          </a>
        </p>
        {primaryMethod === 'YOOKASSA' ? (
          <Button
            type="button"
            size="lg"
            fullWidth
            loading={waiting && checkout.variables?.method === 'YOOKASSA'}
            disabled={waiting}
            onClick={() => void pay('YOOKASSA')}
          >
            Оплатить {price} картой или через СБП
          </Button>
        ) : null}
        {starsAvailable && primaryMethod !== 'STARS' ? (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            loading={waiting && checkout.variables?.method === 'STARS'}
            disabled={waiting}
            onClick={() => void pay('STARS')}
          >
            Оплатить звёздами
          </Button>
        ) : null}
        {primaryMethod === 'STARS' ? (
          <Button
            type="button"
            size="lg"
            fullWidth
            loading={waiting && checkout.variables?.method === 'STARS'}
            disabled={waiting}
            onClick={() => void pay('STARS')}
          >
            Оплатить звёздами
          </Button>
        ) : null}
        {showManual ? (
          <Button
            type="button"
            variant="ghost"
            fullWidth
            disabled={waiting}
            onClick={() => {
              onOpenChange(false);
              onManual?.();
            }}
          >
            Добавить вручную
          </Button>
        ) : null}
        {note ? <p className={css.note}>{note}</p> : null}
      </Stack>
    </Sheet>
  );
}
