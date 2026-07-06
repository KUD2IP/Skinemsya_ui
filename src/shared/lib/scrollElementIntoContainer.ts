const DEFAULT_PADDING = 24;

/** Скроллит элемент внутри scroll-контейнера без window.scrollIntoView. */
export function scrollElementIntoContainer(
  element: HTMLElement,
  container: HTMLElement,
  padding = DEFAULT_PADDING,
): void {
  const elementRect = element.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();

  if (elementRect.top < containerRect.top + padding) {
    container.scrollTop -= containerRect.top + padding - elementRect.top;
  } else if (elementRect.bottom > containerRect.bottom - padding) {
    container.scrollTop += elementRect.bottom - (containerRect.bottom - padding);
  }
}
