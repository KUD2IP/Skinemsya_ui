import { useEffect, useState } from 'react';
import { api } from '@/shared/api';
import { Button, Sheet, Skeleton } from '@/shared/ui';
import * as css from './FilePreview.css';

interface FilePreviewProps {
  fileId: number;
  variant?: 'thumbnail' | 'link';
  linkLabel?: string;
  sheetTitle?: string;
}

interface LoadedFile {
  objectUrl: string;
  mimeType: string;
}

async function loadFilePreview(fileId: number): Promise<LoadedFile> {
  let mimeType = 'application/octet-stream';
  try {
    const meta = await api
      .get(`files/${fileId}`, { searchParams: { sharedAccess: 'true' } })
      .json<{ mimeType: string }>();
    mimeType = meta.mimeType || mimeType;
  } catch {
    // metadata may be unavailable; fall back to blob type below
  }

  const blob = await api
    .get(`files/${fileId}/content`, { searchParams: { sharedAccess: 'true' } })
    .blob();

  return {
    objectUrl: URL.createObjectURL(blob),
    mimeType: mimeType !== 'application/octet-stream' ? mimeType : blob.type || mimeType,
  };
}

function PreviewContent({ file }: { file: LoadedFile }) {
  if (file.mimeType === 'application/pdf') {
    return <iframe src={file.objectUrl} title="PDF" className={css.fullPdf} />;
  }
  return <img src={file.objectUrl} alt="Файл" className={css.fullImage} />;
}

export function FilePreview({
  fileId,
  variant = 'thumbnail',
  linkLabel = 'Посмотреть',
  sheetTitle = 'Файл',
}: FilePreviewProps) {
  const [file, setFile] = useState<LoadedFile | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let loaded: LoadedFile | null = null;
    let cancelled = false;

    void (async () => {
      setLoading(true);
      setError(false);
      try {
        loaded = await loadFilePreview(fileId);
        if (cancelled) return;
        setFile(loaded);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (loaded) URL.revokeObjectURL(loaded.objectUrl);
    };
  }, [fileId]);

  const openSheet = () => {
    if (!error) setFullscreen(true);
  };

  if (variant === 'link') {
    return (
      <>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          loading={loading}
          disabled={error}
          onClick={openSheet}
        >
          {error ? 'Не удалось открыть чек' : linkLabel}
        </Button>
        <Sheet open={fullscreen} onOpenChange={setFullscreen} title={sheetTitle}>
          {file ? (
            <PreviewContent file={file} />
          ) : error ? (
            <p className={css.error}>Не удалось загрузить файл</p>
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

  if (error || !file) {
    return null;
  }

  if (file.mimeType === 'application/pdf') {
    return (
      <>
        <Button type="button" variant="secondary" size="sm" onClick={() => setFullscreen(true)}>
          {linkLabel}
        </Button>
        <Sheet open={fullscreen} onOpenChange={setFullscreen} title={sheetTitle}>
          <PreviewContent file={file} />
        </Sheet>
      </>
    );
  }

  return (
    <>
      <button type="button" className={css.thumbnailButton} onClick={() => setFullscreen(true)}>
        <img src={file.objectUrl} alt="Превью" className={css.thumbnail} />
      </button>
      <Sheet open={fullscreen} onOpenChange={setFullscreen} title={sheetTitle}>
        <PreviewContent file={file} />
      </Sheet>
    </>
  );
}
