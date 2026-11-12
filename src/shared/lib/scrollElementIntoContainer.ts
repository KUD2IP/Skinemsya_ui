const DEFAULT_PADDING = 24;

/** Скроллит элемент внутри scroll-контейнера без window.scrollIntoView. */
export function scrollElementIntoContainer(
  element: HTMLElement,
  container: HTMLElement,
  padding = DEFAULT_PADDING,
  visibleBottom?: number,
): void {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const topLimit = containerRect.top + padding;
  const bottomLimit = Math.min(containerRect.bottom, visibleBottom ?? containerRect.bottom) - padding;

  if (elementRect.top < topLimit) {
    container.scrollTop -= topLimit - elementRect.top;
  } else if (elementRect.bottom > bottomLimit) {
    container.scrollTop += elementRect.bottom - bottomLimit;
  }
}
