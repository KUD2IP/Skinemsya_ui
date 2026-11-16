const warmed = new Set<string>();

/** Начинает загрузку картинки до того, как её покажет экран. Повторный адрес не качается. */
export function warmImage(url: string | null | undefined) {
  if (!url || warmed.has(url)) return;
  warmed.add(url);
  const img = new Image();
  img.decoding = 'async';
  img.src = url;
}

export function warmImages(urls: Array<string | null | undefined>) {
  for (const url of urls) warmImage(url);
}
