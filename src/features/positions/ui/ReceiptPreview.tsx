import { useEffect, useState } from 'react';
import { api } from '@/shared/api';
import { Button, Sheet, Skeleton } from '@/shared/ui';
import * as css from './ReceiptPreview.css';

interface ReceiptPreviewProps {
  fileId: number;
  variant?: 'thumbnail' | 'link';
  linkLabel?: string;
}

async function loadReceiptBlob(fileId: number): Promise<string> {
  const blob = await api
    .get(`files/${fileId}/content`, { searchParams: { sharedAccess: 'true' } })
    .blob();
  return URL.createObjectURL(blob);
}

export function ReceiptPreview({
  fileId,
  variant = 'thumbnail',
  linkLabel = 'Посмотреть чек',
}: ReceiptPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(false);
      try {
        objectUrl = await loadReceiptBlob(fileId);
        if (cancelled) return;
        setPreviewUrl(objectUrl);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [fileId]);

  if (variant === 'link') {
    return (
      <>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={loading || error}
          onClick={() => setFullscreen(true)}
        >
          {linkLabel}
        </Button>
        <Sheet open={fullscreen} onOpenChange={setFullscreen} title="Чек">
          {previewUrl ? (
            <img src={previewUrl} alt="Чек" className={css.fullImage} />
          ) : error ? (
            <p className={css.error}>Не удалось загрузить чек</p>
          ) : (
            <Skeleton height={320} radius="lg" />
          )}
        </Sheet>
      </>
    );
  }

  if (loading) {
    return <Skeleton height={120} radius="lg" />;
  }

  if (error || !previewUrl) {
    return null;
  }

  return (
    <>
      <button type="button" className={css.thumbnailButton} onClick={() => setFullscreen(true)}>
        <img src={previewUrl} alt="Превью чека" className={css.thumbnail} />
      </button>
      <Sheet open={fullscreen} onOpenChange={setFullscreen} title="Чек">
        <img src={previewUrl} alt="Чек" className={css.fullImage} />
      </Sheet>
    </>
  );
}
