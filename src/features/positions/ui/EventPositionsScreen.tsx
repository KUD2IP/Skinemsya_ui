import { useCallback, useMemo, useRef, useState } from 'react';
import { useMutationState } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { CaretLeft, Trash } from '@phosphor-icons/react';
import type { EventResponse, PositionResponse } from '@/shared/api';
import { useUploadFile } from '@/features/files/api/queries';
import { useProfileQuery } from '@/features/profile/api/queries';
import { EditProfileSheet } from '@/features/profile/ui/EditProfileSheet';
import { eventKeys, useSendToDistribution } from '@/features/events/api/queries';
import { EventCapacityBar } from '@/features/events/ui/EventCapacityBar';
import { DeleteEventControl } from '@/features/events/ui/DeleteEventControl';
import { isApiError } from '@/shared/api';
import { ReceiptPaywallSheet, useSubscriptionQuery } from '@/features/subscription';
import {
  eventStatusLabel,
  formatMoney,
  haptics,
  useScreenRefresh,
} from '@/shared/lib';
import {
  Button,
  EmptyState,
  Icon,
  IconButton,
  RefreshIconButton,
  Screen,
  Sheet,
  Skeleton,
  SkeletonCard,
  Stack,
  toast,
  useAnySheetOpen,
} from '@/shared/ui';
import {
  positionKeys,
  receiptKeys,
  useMarkShared,
  useUnmarkShared,
  useDeletePosition,
  useEventReceiptsQuery,
  usePositionsQuery,
  useDiscardReceiptPositions,
  useProcessReceipt,
  useSplitTips,
} from '../api/queries';
import { AddPositionSheet } from './AddPositionSheet';
import { EditPositionSheet } from './EditPositionSheet';
import { ReceiptParseStage } from './ReceiptParseStage';
import { ReceiptPreview } from './ReceiptPreview';
import {
  AddManualButton,
  PositionCard,
  ReceiptUploadButton,
} from './PositionCard';
import * as css from './EventPositionsScreen.css';

interface EventPositionsScreenProps {
  groupId: number;
  eventId: number;
  event: EventResponse;
  currentUserId?: number;
}

type ParsePhase = 'idle' | 'uploading' | 'processing' | 'success' | 'failed';

export function EventPositionsScreen({
  groupId,
  eventId,
  event,
  currentUserId,
}: EventPositionsScreenProps) {
  const navigate = useNavigate();
  const { data: positions, isLoading, isError, refetch } = usePositionsQuery(eventId);
  const { data: receipts } = useEventReceiptsQuery(eventId);
  const { refresh, refreshing } = useScreenRefresh([
    positionKeys.byEvent(eventId),
    receiptKeys.byEvent(eventId),
    eventKeys.detail(eventId),
  ]);
  const { data: payerProfile } = useProfileQuery();
  const uploadFile = useUploadFile(eventId);
  const processReceipt = useProcessReceipt(eventId);
  const markShared = useMarkShared(eventId);
  const unmarkShared = useUnmarkShared(eventId);
  const deletePosition = useDeletePosition(eventId);
  const splitTips = useSplitTips(eventId);
  const discardReceipt = useDiscardReceiptPositions(eventId);
  const sendToDistribution = useSendToDistribution(eventId, groupId);
  const subscription = useSubscriptionQuery();

  const [adding, setAdding] = useState(false);
  const [editingPosition, setEditingPosition] = useState<PositionResponse | null>(null);
  const [confirmLaunch, setConfirmLaunch] = useState(false);
  const [requisitesOpen, setRequisitesOpen] = useState(false);
  const [parsePhase, setParsePhase] = useState<ParsePhase>('idle');
  const [parseError, setParseError] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [confirmSecond, setConfirmSecond] = useState(false);
  const openPicker = useRef<(() => void) | null>(null);
  const bindOpen = useCallback((open: () => void) => {
    openPicker.current = open;
  }, []);
  const sheetOpen = useAnySheetOpen();

  const canLaunch =
    currentUserId != null &&
    (event.payerId === currentUserId || event.createdBy === currentUserId);

  const isPayer = currentUserId === event.payerId;
  const localRequisitesReady = Boolean(
    payerProfile?.phone?.trim() || payerProfile?.paymentDetails?.trim(),
  );
  const payerHasDetails = isPayer ? localRequisitesReady : event.payerRequisitesReady;

  const totalKopecks = useMemo(
    () => (positions ?? []).reduce((sum, p) => sum + p.totalPriceKopecks, 0),
    [positions],
  );

  const tipsReceiptId = useMemo(() => {
    const tipsPosition = (positions ?? []).find((p) => p.tips && p.receiptId != null);
    return tipsPosition?.receiptId ?? null;
  }, [positions]);

  const receiptIdsWithPositions = useMemo(() => {
    const ids = new Set<number>();
    for (const position of positions ?? []) {
      if (position.source === 'RECEIPT' && position.receiptId != null) ids.add(position.receiptId);
    }
    return ids;
  }, [positions]);

  const discardReceiptId = receipts?.find((receipt) => receiptIdsWithPositions.has(receipt.id))?.id;
  const mismatch = receipts?.find(
    (receipt) =>
      receipt.sumMismatch && receipt.totalKopecks != null && receipt.itemsSumKopecks != null,
  );
  const receiptParseInFlight = useMutationState({
    filters: { mutationKey: ['receipt-parse', eventId], status: 'pending' },
    select: (mutation) => mutation.state.submittedAt,
  });
  const parsing =
    parsePhase === 'uploading' || parsePhase === 'processing' || receiptParseInFlight.length > 0;

  const beforeOpenReceipt = () => {
    if (!subscription.data) return subscription.isError;
    if (!subscription.data.active) {
      setPaywallOpen(true);
      return false;
    }
    if (receiptIdsWithPositions.size > 0) {
      setConfirmSecond(true);
      return false;
    }
    return true;
  };

  const handleReceiptFile = async (file: File) => {
    setParsePhase('uploading');
    setParseError(null);
    try {
      const uploaded = await uploadFile.mutateAsync({ file, purpose: 'receipt' });
      setParsePhase('processing');
      const receipt = await processReceipt.mutateAsync({ fileId: uploaded.id });
      if (receipt.status === 'FAILED') {
        setParsePhase('failed');
        setParseError('Не увидели позиции. Снимите чек целиком, без бликов');
      } else {
        setParsePhase('success');
        haptics.success();
        toast.success('Чек обработан');
      }
    } catch (error) {
      if (isApiError(error) && error.code === 'SUBSCRIPTION_REQUIRED') {
        setParsePhase('idle');
        setPaywallOpen(true);
        return;
      }
      setParsePhase('failed');
      setParseError(isApiError(error) ? error.message : 'Не удалось обработать чек');
      haptics.error();
    }
  };

  const handleDiscard = async (receiptId: number) => {
    try {
      await discardReceipt.mutateAsync(receiptId);
      haptics.success();
      toast.success('Чек удалён');
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось удалить чек');
    }
  };

  const handleLaunch = async () => {
    try {
      await sendToDistribution.mutateAsync();
      haptics.success();
      toast.success('Сбор запущен');
      setConfirmLaunch(false);
      void refetch();
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось запустить сбор');
    }
  };

  const handleSplitTips = async () => {
    if (tipsReceiptId == null) return;
    try {
      await splitTips.mutateAsync(tipsReceiptId);
      haptics.success();
      toast.success('Чаевые разделены на всех');
    } catch (error) {
      haptics.error();
      toast.error(isApiError(error) ? error.message : 'Не удалось разделить чаевые');
    }
  };

  return (
    <Screen
      title={event.name}
      subtitle={eventStatusLabel(event.status)}
      headerLeading={
        <IconButton
          aria-label="Назад"
          onClick={() => void navigate({ to: '/groups/$groupId', params: { groupId: String(groupId) } })}
        >
          <Icon icon={CaretLeft} weight="bold" />
        </IconButton>
      }
      refreshing={refreshing && !isLoading}
      headerAction={<RefreshIconButton refreshing={refreshing} onRefresh={() => void refresh()} />}
    >
      {isLoading ? (
        <Stack gap={4}>
          <Skeleton height={10} radius="full" />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </Stack>
      ) : isError ? (
        <EmptyState
          title="Не удалось загрузить позиции"
          actions={
            <Button variant="secondary" loading={refreshing} onClick={() => void refresh()}>
              Повторить
            </Button>
          }
        />
      ) : (
        <div className={css.page}>
          {parsing ? <ReceiptParseStage /> : null}
          <div className={parsing ? css.screenBodyHidden : css.screenBody}>
            <EventCapacityBar event={event} currentUserId={currentUserId} />
            <div className={css.uploadRow}>
              <ReceiptUploadButton
                className={css.uploadAction}
                onFileSelected={(file) => void handleReceiptFile(file)}
                loading={
                  parsePhase === 'uploading' ||
                  parsePhase === 'processing' ||
                  (subscription.isPending && !subscription.data)
                }
                beforeOpen={beforeOpenReceipt}
                bindOpen={bindOpen}
              />
              <AddManualButton className={css.uploadAction} onClick={() => setAdding(true)} />
            </div>
            <p className={css.photoHint}>Снимите чек целиком, при ровном освещении</p>

            {event.status === 'DRAFT' && receipts && receipts.length > 0 ? (
              <Stack gap={2}>
                {receipts.map((receipt) => (
                  <div key={receipt.id} className={css.receiptRow}>
                    <div className={css.receiptPreview}>
                      <ReceiptPreview fileId={receipt.fileId} variant="thumbnail" />
                    </div>
                    <IconButton
                      aria-label="Удалить чек"
                      disabled={discardReceipt.isPending}
                      onClick={() => void handleDiscard(receipt.id)}
                    >
                      <Icon icon={Trash} />
                    </IconButton>
                  </div>
                ))}
              </Stack>
            ) : receipts?.[0] ? (
              <ReceiptPreview fileId={receipts[0].fileId} variant="thumbnail" />
            ) : null}

            {parsePhase === 'success' ? (
              <p className={css.bannerInfo}>Позиции добавлены из чека</p>
            ) : null}
            {parsePhase === 'failed' ? (
              <div className={css.bannerError}>
                {parseError ?? 'Не увидели позиции. Снимите чек целиком, без бликов'}
                {subscription.data?.currentPeriodEnd ? (
                  <p>Оплачены 30 дней распознавания, не один снимок.</p>
                ) : null}
                <Stack gap={2}>
                  <Button type="button" variant="secondary" size="sm" onClick={() => setAdding(true)}>
                    Добавить вручную
                  </Button>
                </Stack>
              </div>
            ) : null}

            {mismatch ? (
              <p className={css.bannerWarning}>
                Блюда на {formatMoney(mismatch.itemsSumKopecks ?? 0)}, на чеке итог{' '}
                {formatMoney(mismatch.totalKopecks ?? 0)}. Проверьте чаевые, скидку или поправьте строки.
              </p>
            ) : null}

            {discardReceiptId != null ? (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                loading={discardReceipt.isPending && discardReceipt.variables === discardReceiptId}
                onClick={() => void handleDiscard(discardReceiptId)}
              >
                Удалить чек и позиции
              </Button>
            ) : null}

            {tipsReceiptId != null ? (
              <div className={css.bannerInfo}>
                <Stack gap={3}>
                  <span>Разделить чаевые на всех?</span>
                  <Button
                    type="button"
                    size="sm"
                    loading={splitTips.isPending}
                    onClick={() => void handleSplitTips()}
                  >
                    Разделить
                  </Button>
                </Stack>
              </div>
            ) : null}

            {!payerHasDetails && canLaunch ? (
              <div className={css.gateCard}>
                <span>
                  {isPayer
                    ? 'Добавьте телефон для СБП, чтобы запустить сбор'
                    : 'Плательщик должен указать телефон для СБП в профиле'}
                </span>
                {isPayer ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => setRequisitesOpen(true)}
                  >
                    Добавить телефон
                  </Button>
                ) : null}
              </div>
            ) : null}

            <Stack gap={3}>
              {(positions ?? []).map((position) => (
                <PositionCard
                  key={position.id}
                  position={position}
                  onEdit={(p) => setEditingPosition(p)}
                  onMarkShared={(id) =>
                    void markShared.mutateAsync({ id, body: { forAll: true } }).catch((error) => {
                      haptics.error();
                      toast.error(isApiError(error) ? error.message : 'Не удалось отметить');
                    })
                  }
                  markingShared={
                    markShared.isPending && markShared.variables?.id === position.id
                  }
                  onUnmarkShared={(id) =>
                    void unmarkShared.mutateAsync(id).catch((error) => {
                      haptics.error();
                      toast.error(isApiError(error) ? error.message : 'Не удалось отменить');
                    })
                  }
                  unmarkingShared={
                    unmarkShared.isPending && unmarkShared.variables === position.id
                  }
                  onDelete={(id) =>
                    void deletePosition.mutateAsync(id).catch((error) => {
                      haptics.error();
                      toast.error(isApiError(error) ? error.message : 'Не удалось удалить');
                    })
                  }
                  deleting={
                    deletePosition.isPending && deletePosition.variables === position.id
                  }
                />
              ))}
            </Stack>

            {!positions?.length ? (
              <EmptyState
                title="Пока нет позиций"
                description="Загрузите чек или добавьте позиции вручную."
              />
            ) : null}

            <DeleteEventControl groupId={groupId} event={event} currentUserId={currentUserId} />
          </div>

          {canLaunch && !sheetOpen && !parsing && (positions?.length ?? 0) > 0 ? (
            <div className={css.stickyFooter}>
              <div className={css.footerPreview}>
                <span>
                  {event.joinedCount}/{event.expectedParticipantCount} в сборе
                </span>
                <span className={css.footerTotal}>Итого: {formatMoney(totalKopecks)}</span>
              </div>
              <Button
                type="button"
                fullWidth
                disabled={!payerHasDetails}
                onClick={() => setConfirmLaunch(true)}
              >
                Запустить сбор
              </Button>
            </div>
          ) : null}
        </div>
      )}

      <AddPositionSheet open={adding} onOpenChange={setAdding} eventId={eventId} />

      <EditPositionSheet
        open={editingPosition != null}
        onOpenChange={(open) => {
          if (!open) setEditingPosition(null);
        }}
        eventId={eventId}
        position={editingPosition}
      />

      <Sheet
        open={confirmLaunch}
        onOpenChange={setConfirmLaunch}
        title="Запустить сбор?"
        description="Участники смогут выбирать позиции. Если в списке ошибка, сбор можно вернуть в подготовку, пока никто не отметил перевод."
      >
        <Stack gap={3}>
          <Button
            type="button"
            fullWidth
            loading={sendToDistribution.isPending}
            onClick={() => void handleLaunch()}
          >
            Запустить сбор
          </Button>
          <Button type="button" variant="secondary" fullWidth onClick={() => setConfirmLaunch(false)}>
            Отмена
          </Button>
        </Stack>
      </Sheet>

      <Sheet
        open={confirmSecond}
        onOpenChange={setConfirmSecond}
        title="Ещё один чек"
        description="Добавить ещё один чек? Уже добавленные блюда останутся."
      >
        <Stack gap={3}>
          <Button
            type="button"
            fullWidth
            onClick={() => {
              setConfirmSecond(false);
              openPicker.current?.();
            }}
          >
            Добавить чек
          </Button>
          <Button type="button" variant="secondary" fullWidth onClick={() => setConfirmSecond(false)}>
            Отмена
          </Button>
        </Stack>
      </Sheet>

      <ReceiptPaywallSheet
        open={paywallOpen}
        onOpenChange={setPaywallOpen}
        onManual={() => setAdding(true)}
        onActivated={() => openPicker.current?.()}
      />

      {payerProfile ? (
        <EditProfileSheet
          open={requisitesOpen}
          onOpenChange={setRequisitesOpen}
          user={payerProfile}
          focusField="phone"
          title="Реквизиты для сбора"
          description="Укажите телефон для СБП, чтобы участники могли перевести вам деньги."
        />
      ) : null}
    </Screen>
  );
}
