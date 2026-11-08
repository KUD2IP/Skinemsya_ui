import { useEffect, useRef, useState } from 'react';
import { isApiError, type SubscriptionProvider, type SubscriptionResponse } from '@/shared/api';
import { formatMoney } from '@/shared/lib';
import { Button, Sheet, Stack } from '@/shared/ui';
import { useSubscriptionCheckout, useSubscriptionQuery } from '../api/queries';
import { openExternal, openInvoice } from '../lib/telegramPay';
import { loadYooKassaWidget, mountYooKassaWidget } from '../lib/yookassaWidget';
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
  attempts = 12,
  baseline: string | null = null,
) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const result = await refetch();
    const periodEnd = result.data?.currentPeriodEnd;
    if (result.data?.active && periodEnd && periodEnd !== baseline) return true;
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
  const [widgetToken, setWidgetToken] = useState<string | null>(null);
  const alive = useRef(true);
  const periodBaseline = useRef<string | null>(null);
  const closePaid = useRef<() => void>(() => undefined);
  const refetchSubscription = useRef(subscription.refetch);
  refetchSubscription.current = subscription.refetch;

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (open) setNote(null);
    if (!open) setWidgetToken(null);
  }, [open]);

  closePaid.current = () => {
    setWaiting(false);
    onOpenChange(false);
    onActivated?.();
  };

  useEffect(() => {
    if (!open || !widgetToken) return;
    let destroy = () => {};
    let cancelled = false;
    void loadYooKassaWidget()
      .then(() => {
        if (cancelled) return;
        destroy = mountYooKassaWidget(
          widgetToken,
          'yookassa-widget',
          () => undefined,
          () => {
            if (!alive.current) return;
            setWaiting(false);
            setNote('Оплата не прошла');
          },
        );
      })
      .catch(() => {
        if (!alive.current) return;
        setWaiting(false);
        setNote('Не удалось открыть оплату');
      });
    void (async () => {
      const paid = await waitForActivation(
        () => refetchSubscription.current(),
        () => alive.current && !cancelled,
        90,
        periodBaseline.current,
      );
      if (!cancelled && paid) closePaid.current();
    })();
    return () => {
      cancelled = true;
      destroy();
    };
  }, [open, widgetToken]);

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

  const pay = async (method: SubscriptionProvider, sbp = false) => {
    setWaiting(true);
    setNote(null);
    periodBaseline.current = subscription.data?.currentPeriodEnd ?? null;
    try {
      const result = await checkout.mutateAsync({ method, sbp });
      if (result.confirmationToken) {
        setWidgetToken(result.confirmationToken);
        setWaiting(false);
        return;
      }
      if (result.confirmationUrl) {
        openExternal(result.confirmationUrl);
        finish(
          await waitForActivation(
            () => subscription.refetch(),
            () => alive.current,
            12,
            periodBaseline.current,
          ),
        );
        return;
      }
      if (result.invoiceLink) {
        const status = await openInvoice(result.invoiceLink);
        if (status === 'cancelled') {
          setWaiting(false);
          return;
        }
        if (status === 'failed') setNote(PAID_NOTE);
        finish(
          await waitForActivation(
            () => subscription.refetch(),
            () => alive.current,
            12,
            periodBaseline.current,
          ),
        );
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
          30 дней. Карта и СБП оплачивают один период, следующий — отдельной оплатой. Звёзды
          продлеваются в Telegram, отмена в профиле.{' '}
          <a className={css.offerLink} href="/legal">
            Оферта и реквизиты
          </a>
        </p>
        {widgetToken ? <div id="yookassa-widget" className={css.widget} /> : null}
        {!widgetToken && primaryMethod === 'YOOKASSA' ? (
          <Button
            type="button"
            size="lg"
            fullWidth
            loading={waiting && checkout.variables?.method === 'YOOKASSA' && !checkout.variables.sbp}
            disabled={waiting}
            onClick={() => void pay('YOOKASSA')}
          >
            Оплатить {price} картой
          </Button>
        ) : null}
        {primaryMethod === 'YOOKASSA' ? (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            loading={waiting && checkout.variables?.sbp === true}
            disabled={waiting}
            onClick={() => void pay('YOOKASSA', true)}
          >
            Через СБП
          </Button>
        ) : null}
        {!widgetToken && starsAvailable && primaryMethod !== 'STARS' ? (
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
        {!widgetToken && primaryMethod === 'STARS' ? (
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
        {!widgetToken && showManual ? (
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
