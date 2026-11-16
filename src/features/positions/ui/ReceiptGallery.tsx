import { useEffect, useState } from 'react';
import { FileBody, loadFilePreview } from '@/features/files/ui/FilePreview';
import { Button, Sheet, Stack } from '@/shared/ui';
import * as css from './ReceiptGallery.css';

export interface ReceiptGalleryItem {
  id: number;
  fileId: number;
}

interface ReceiptGalleryProps {
  receipts: ReceiptGalleryItem[];
  onDiscard?: (receiptId: number) => void;
  discardPendingId?: number | null;
}

export function ReceiptGallery({ receipts, onDiscard, discardPendingId }: ReceiptGalleryProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const active = receipts.find((receipt) => receipt.id === selectedId) ?? receipts[0];

  useEffect(() => {
    for (const receipt of receipts) void loadFilePreview(receipt.fileId);
  }, [receipts]);

  if (!active) return null;

  return (
    <>
      <div>
        <Button type="button" variant="secondary" size="sm" onClick={() => setOpen(true)}>
          Посмотреть чек
        </Button>
      </div>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        title={receipts.length > 1 ? `Чек ${receipts.findIndex((receipt) => receipt.id === active.id) + 1}` : 'Чек'}
      >
        <Stack gap={4}>
          {receipts.length > 1 ? (
            <div className={css.switcher} role="tablist" aria-label="Чеки сбора">
              {receipts.map((receipt, index) => {
                const selected = receipt.id === active.id;
                return (
                  <Button
                    key={receipt.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    size="md"
                    variant={selected ? 'primary' : 'secondary'}
                    className={css.chip}
                    onClick={() => setSelectedId(receipt.id)}
                  >
                    Чек {index + 1}
                  </Button>
                );
              })}
            </div>
          ) : null}
          <FileBody key={active.fileId} fileId={active.fileId} />
          {onDiscard ? (
            <Button
              type="button"
              variant="danger"
              loading={discardPendingId === active.id}
              onClick={() => onDiscard(active.id)}
            >
              Удалить чек
            </Button>
          ) : null}
        </Stack>
      </Sheet>
    </>
  );
}
