import { useMemo, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CaretLeft } from '@phosphor-icons/react';
import type { EventResponse, PositionResponse } from '@/shared/api';
import { useUploadFile } from '@/features/files/api/queries';
import { useGroupMembersQuery } from '@/features/groups/api/queries';
import { useProfileQuery } from '@/features/profile/api/queries';
import { useSendToDistribution } from '@/features/events/api/queries';
import { isApiError } from '@/shared/api';
import {
  eventStatusLabel,
  formatMoney,
  haptics,
} from '@/shared/lib';
import {
  Button,
  EmptyState,
  Icon,
  IconButton,
  Screen,
  Sheet,
  Skeleton,
  Stack,
  toast,
  useAnySheetOpen,
} from '@/shared/ui';
import {
  useMarkShared,
  useDeletePosition,
  useEventReceiptsQuery,
  usePositionsQuery,
  useProcessReceipt,
  useSplitTips,
} from '../api/queries';
import { AddPositionSheet } from './AddPositionSheet';
import { EditPositionSheet } from './EditPositionSheet';
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
  const { data: members } = useGroupMembersQuery(groupId);
  const { data: payerProfile } = useProfileQuery();
  const uploadFile = useUploadFile();
  const processReceipt = useProcessReceipt(eventId);
  const markShared = useMarkShared(eventId);
  const deletePosition = useDeletePosition(eventId);
  const splitTips = useSplitTips(eventId);
  const sendToDistribution = useSendToDistribution(eventId, groupId);

  const [adding, setAdding] = useState(false);
  const [editingPosition, setEditingPosition] = useState<PositionResponse | null>(null);
  const [confirmLaunch, setConfirmLaunch] = useState(false);
  const [parsePhase, setParsePhase] = useState<ParsePhase>('idle');
  const [parseError, setParseError] = useState<string | null>(null);
  const sheetOpen = useAnySheetOpen();

  const canLaunch =
    currentUserId != null &&
    (event.payerId === currentUserId || event.createdBy === currentUserId);

  const isPayer = currentUserId === event.payerId;
  const payerHasDetails =
    !isPayer || Boolean(payerProfile?.paymentDetails?.trim());

  const totalKopecks = useMemo(
    () => (positions ?? []).reduce((sum, p) => sum + p.totalPriceKopecks, 0),
    [positions],
  );

  const tipsReceiptId = useMemo(() => {
    const tipsPosition = (positions ?? []).find((p) => p.tips && p.receiptId != null);
    return tipsPosition?.receiptId ?? null;
  }, [positions]);

  const participantCount = members?.length ?? 0;

  const handleReceiptFile = async (file: File) => {
    setParsePhase('uploading');
    setParseError(null);
    try {
      const uploaded = await uploadFile.mutateAsync({ file, purpose: 'receipt' });
      setParsePhase('processing');
      const receipt = await processReceipt.mutateAsync({ fileId: uploaded.id });
      if (receipt.status === 'FAILED') {
        setParsePhase('failed');
        setParseError('Не распознали чек');
      } else {
        setParsePhase('success');
        haptics.success();
        toast.success('Чек обработан');
      }
    } catch (error) {
      setParsePhase('failed');
      setParseError(isApiError(error) ? error.message : 'Не удалось обработать чек');
      haptics.error();
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
    >
      {isLoading ? (
        <Stack gap={4}>
          <Skeleton height={120} radius="lg" />
          <Skeleton height={88} radius="lg" />
          <Skeleton height={88} radius="lg" />
        </Stack>
      ) : isError ? (
        <EmptyState
          title="Не удалось загрузить позиции"
          actions={
            <Button variant="secondary" onClick={() => void refetch()}>
              Повторить
            </Button>
          }
        />
      ) : (
        <div className={css.page}>
          <div className={css.screenBody}>
            <div className={css.uploadRow}>
              <ReceiptUploadButton
                onFileSelected={(file) => void handleReceiptFile(file)}
                loading={parsePhase === 'uploading' || parsePhase === 'processing'}
              />
              <AddManualButton onClick={() => setAdding(true)} />
            </div>

            {receipts?.[0] ? (
              <ReceiptPreview fileId={receipts[0].fileId} variant="thumbnail" />
            ) : null}

            {parsePhase === 'processing' ? (
              <p className={css.bannerInfo}>Читаем чек…</p>
            ) : null}
            {parsePhase === 'success' ? (
              <p className={css.bannerInfo}>Позиции добавлены из чека</p>
            ) : null}
            {parsePhase === 'failed' ? (
              <div className={css.bannerError}>
                {parseError ?? 'Не распознали'}
                <Stack gap={2}>
                  <Button type="button" variant="secondary" size="sm" onClick={() => setAdding(true)}>
                    Добавить вручную
                  </Button>
                </Stack>
              </div>
            ) : null}

            {(positions ?? []).some((p) => p.lowConfidence) ? (
              <p className={css.bannerWarning}>Проверьте позиции вручную — низкая уверенность распознавания</p>
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

            {!payerHasDetails && isPayer && canLaunch ? (
              <div className={css.gateCard}>
                <span>Добавьте реквизиты плательщика, чтобы запустить сбор</span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void navigate({ to: '/profile' })}
                >
                  Перейти в профиль
                </Button>
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
                  markingShared={markShared.isPending}
                  onDelete={(id) =>
                    void deletePosition.mutateAsync(id).catch((error) => {
                      haptics.error();
                      toast.error(isApiError(error) ? error.message : 'Не удалось удалить');
                    })
                  }
                  deleting={deletePosition.isPending}
                />
              ))}
            </Stack>

            {!positions?.length ? (
              <EmptyState
                title="Пока нет позиций"
                description="Загрузите чек или добавьте позиции вручную."
              />
            ) : null}
          </div>

          {canLaunch && !sheetOpen && (positions?.length ?? 0) > 0 ? (
            <div className={css.stickyFooter}>
              <div className={css.footerPreview}>
                <span>
                  {participantCount === 1
                    ? '1 участник — остальные добавятся автоматически'
                    : `${participantCount} участников`}
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
        description="Участники смогут выбирать блюда. Изменить список потом нельзя."
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
    </Screen>
  );
}
