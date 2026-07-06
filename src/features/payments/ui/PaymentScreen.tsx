import { useEffect, useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CaretLeft, Copy } from '@phosphor-icons/react';
import type { EventResponse, PaymentStatus } from '@/shared/api';
import { useUploadFile } from '@/features/files/api/queries';
import { isApiError } from '@/shared/api';
import { formatMoney, formatPhone, haptics } from '@/shared/lib';
import {
  Button,
  EmptyState,
  Icon,
  IconButton,
  Screen,
  Skeleton,
  Stack,
  toast,
} from '@/shared/ui';
import { useConfirmDebtor, usePaymentDetailsQuery } from '../api/queries';
import { preferredBankLabel } from '@/features/profile/model/banks';
import * as css from './PaymentScreen.css';

interface PaymentScreenProps {
  groupId: number;
  eventId: number;
  event: EventResponse;
  debtId: number;
  currentUserId?: number;
}

function paymentStatusMessage(status: PaymentStatus): string | null {
  switch (status) {
    case 'DEBTOR_CONFIRMED':
      return 'Долг отправлен. Ожидаем подтверждение от плательщика.';
    case 'PAYER_CONFIRMED':
      return 'Плательщик подтвердил перевод.';
    case 'DISPUTED':
      return 'Плательщик не увидел перевод. Отправь перевод снова.';
    default:
      return null;
  }
}

export function PaymentScreen({
  groupId,
  eventId,
  event,
  debtId,
}: PaymentScreenProps) {
  const navigate = useNavigate();
  const { data: details, isLoading, isError, refetch } = usePaymentDetailsQuery(debtId);
  const uploadFile = useUploadFile();
  const confirmDebtor = useConfirmDebtor(debtId, eventId, groupId);
  const inputRef = useRef<HTMLInputElement>(null);
  const [screenshotFileId, setScreenshotFileId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const paymentStatus = details?.status;
  const isWaitingForPayer = paymentStatus === 'DEBTOR_CONFIRMED';
  const isConfirmed = paymentStatus === 'PAYER_CONFIRMED';
  const canSubmit = !isWaitingForPayer && !isConfirmed;
  const statusMessage = paymentStatus ? paymentStatusMessage(paymentStatus) : null;

  useEffect(() => {
    if (paymentStatus === 'DISPUTED' || paymentStatus === 'CREATED') {
      setScreenshotFileId(null);
    }
  }, [paymentStatus]);

  useEffect(() => {
    if (!isWaitingForPayer) return;

    const poll = () => void refetch();
    const onVisible = () => {
      if (document.visibilityState === 'visible') poll();
    };

    document.addEventListener('visibilitychange', onVisible);
    const intervalId = window.setInterval(poll, 3_000);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.clearInterval(intervalId);
    };
  }, [isWaitingForPayer, refetch]);

  const copyText = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      haptics.success();
      toast.success(successMessage);
    } catch {
      toast.error('Не удалось скопировать');
    }
  };

  const copyCard = async () => {
    if (!details?.paymentDetails) return;
    const digits = details.paymentDetails.replace(/\D/g, '');
    await copyText(digits || details.paymentDetails, 'Номер карты скопирован');
  };

  const copyPhone = async () => {
    if (!details?.phone) return;
    await copyText(details.phone, 'Телефон скопирован');
  };

  const handleScreenshot = async (file: File) => {
    setUploading(true);
    try {
      const uploaded = await uploadFile.mutateAsync({ file, purpose: 'payment-proof' });
      setScreenshotFileId(uploaded.id);
      haptics.success();
      toast.success('Чек перевода загружен');
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось загрузить чек перевода');
    } finally {
      setUploading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await confirmDebtor.mutateAsync(
        screenshotFileId != null ? { screenshotFileId } : {},
      );
      haptics.success();
      toast.success('Отправлено на проверку');
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось отправить');
    }
  };

  return (
    <Screen
      title={event.name}
      subtitle="Скинуть"
      headerLeading={
        <IconButton
          aria-label="Назад"
          onClick={() => void navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } })}
        >
          <Icon icon={CaretLeft} weight="bold" />
        </IconButton>
      }
    >
      {isLoading ? (
        <Stack gap={4}>
          <Skeleton height={80} radius="lg" />
          <Skeleton height={120} radius="lg" />
        </Stack>
      ) : isError || !details ? (
        <EmptyState
          title="Не удалось загрузить реквизиты"
          actions={
            <Button variant="secondary" onClick={() => void refetch()}>
              Повторить
            </Button>
          }
        />
      ) : (
        <Stack gap={6}>
          <div className={css.amountBlock}>
            <span className={css.amountLabel}>К переводу</span>
            <span className={css.amountValue}>{formatMoney(details.amountKopecks)}</span>
          </div>

          <div className={css.detailsCard}>
            <Stack gap={3}>
              <span className={css.creditorName}>{details.creditorName}</span>
              {details.preferredBank ? (
                <p className={css.detailsMeta}>{preferredBankLabel(details.preferredBank)}</p>
              ) : null}
              {details.paymentDetails?.trim() ? (
                <div className={css.detailRow}>
                  <Stack gap={1} flex={1}>
                    <span className={css.detailLabel}>Карта</span>
                    <p className={css.detailsText}>{details.paymentDetails}</p>
                  </Stack>
                  <IconButton
                    variant="bare"
                    aria-label="Скопировать карту"
                    onClick={() => void copyCard()}
                  >
                    <Icon icon={Copy} size="sm" />
                  </IconButton>
                </div>
              ) : null}
              {details.phone ? (
                <div className={css.detailRow}>
                  <Stack gap={1} flex={1}>
                    <span className={css.detailLabel}>Телефон для СБП</span>
                    <p className={css.detailsText}>{formatPhone(details.phone)}</p>
                  </Stack>
                  <IconButton
                    variant="bare"
                    aria-label="Скопировать телефон"
                    onClick={() => void copyPhone()}
                  >
                    <Icon icon={Copy} size="sm" />
                  </IconButton>
                </div>
              ) : null}
            </Stack>
          </div>

          {canSubmit ? (
            <>
              <p className={css.hint}>
                {paymentStatus === 'DISPUTED'
                  ? 'Отправь перевод повторно. Чек можно прикрепить, но это необязательно'
                  : 'Переведи в банке и нажми «Отправил». Чек можно прикрепить, но это необязательно'}
              </p>

              <input
                ref={inputRef}
                type="file"
                accept="image/*,application/pdf,.pdf"
                className={css.hiddenInput}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleScreenshot(file);
                  e.target.value = '';
                }}
              />

              <Button
                type="button"
                variant="secondary"
                loading={uploading}
                onClick={() => inputRef.current?.click()}
              >
                {screenshotFileId ? 'Чек прикреплён' : 'Прикрепить чек перевода'}
              </Button>

              <Button
                type="button"
                fullWidth
                loading={confirmDebtor.isPending}
                onClick={() => void handleConfirm()}
              >
                Отправил
              </Button>
            </>
          ) : statusMessage ? (
            <div
              className={
                isConfirmed ? css.statusCardSuccess : css.statusCardWaiting
              }
            >
              <p className={css.statusMessage}>{statusMessage}</p>
            </div>
          ) : null}
        </Stack>
      )}
    </Screen>
  );
}
