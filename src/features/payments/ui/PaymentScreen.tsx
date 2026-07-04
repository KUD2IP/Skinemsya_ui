import { useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CaretLeft, Copy } from '@phosphor-icons/react';
import type { EventResponse } from '@/shared/api';
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
    if (screenshotFileId == null) return;
    try {
      await confirmDebtor.mutateAsync({ screenshotFileId });
      haptics.success();
      toast.success('Отправлено на проверку');
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось отправить');
    }
  };

  const alreadySent =
    details?.status === 'DEBTOR_CONFIRMED' || details?.status === 'PAYER_CONFIRMED';

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

          <p className={css.hint}>Переведи в банке и вернись сюда с подтверждением перевода</p>

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
            disabled={screenshotFileId == null || alreadySent}
            loading={confirmDebtor.isPending}
            onClick={() => void handleConfirm()}
          >
            Отправил
          </Button>

          {alreadySent ? (
            <p className={css.hint}>Перевод отправлен на проверку плательщику</p>
          ) : null}
        </Stack>
      )}
    </Screen>
  );
}
