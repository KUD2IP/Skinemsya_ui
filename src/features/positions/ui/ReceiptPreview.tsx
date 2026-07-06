import { FilePreview } from '@/features/files/ui/FilePreview';

interface ReceiptPreviewProps {
  fileId: number;
  variant?: 'thumbnail' | 'link';
  linkLabel?: string;
}

export function ReceiptPreview({
  fileId,
  variant = 'thumbnail',
  linkLabel = 'Посмотреть чек',
}: ReceiptPreviewProps) {
  return (
    <FilePreview
      fileId={fileId}
      variant={variant}
      linkLabel={linkLabel}
      sheetTitle="Чек"
    />
  );
}
