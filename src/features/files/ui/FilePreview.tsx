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

const resolvedFiles = new Map<number, LoadedFile>();
const inflightFiles = new Map<number, Promise<LoadedFile>>();

function peekLoadedFile(fileId: number): LoadedFile | null {
  return resolvedFiles.get(fileId) ?? null;
}

/** Один запрос содержимого, повторные открытия берут уже скачанный файл. */
export function loadFilePreview(fileId: number): Promise<LoadedFile> {
  const ready = resolvedFiles.get(fileId);
  if (ready) return Promise.resolve(ready);
  const pending = inflightFiles.get(fileId);
  if (pending) return pending;

  const request = api
    .get(`files/${fileId}/content`, { searchParams: { sharedAccess: 'true' } })
    .blob()
    .then((blob) => {
      const file: LoadedFile = {
        objectUrl: URL.createObjectURL(blob),
        mimeType: blob.type || 'application/octet-stream',
      };
      resolvedFiles.set(fileId, file);
      inflightFiles.delete(fileId);
      return file;
    })
    .catch((error: unknown) => {
      inflightFiles.delete(fileId);
      throw error;
    });

  inflightFiles.set(fileId, request);
  return request;
}

function useLoadedFile(fileId: number) {
  const cached = peekLoadedFile(fileId);
  const [file, setFile] = useState<LoadedFile | null>(cached);
  const [loading, setLoading] = useState(cached == null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const ready = peekLoadedFile(fileId);
    if (ready) {
      setFile(ready);
      setLoading(false);
      setError(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);
    void loadFilePreview(fileId).then(
      (loaded) => {
        if (cancelled) return;
        setFile(loaded);
        setLoading(false);
      },
      () => {
        if (cancelled) return;
        setError(true);
        setLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [fileId]);

  return { file, loading, error };
}

function PreviewContent({ file }: { file: LoadedFile }) {
  if (file.mimeType === 'application/pdf') {
    return <iframe src={file.objectUrl} title="PDF" className={css.fullPdf} />;
  }
  return <img src={file.objectUrl} alt="Файл" className={css.fullImage} />;
}

/** Содержимое файла без своей кнопки и шторки. Берёт уже скачанный файл, если он есть. */
export function FileBody({ fileId }: { fileId: number }) {
  const { file, loading, error } = useLoadedFile(fileId);
  if (loading) return <Skeleton height={320} radius="lg" />;
  if (error || !file) return <p className={css.error}>Не удалось загрузить файл</p>;
  return <PreviewContent file={file} />;
}

export function FilePreview({
  fileId,
  variant = 'thumbnail',
  linkLabel = 'Посмотреть',
  sheetTitle = 'Файл',
}: FilePreviewProps) {
  const { file, loading, error } = useLoadedFile(fileId);
  const [fullscreen, setFullscreen] = useState(false);

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
