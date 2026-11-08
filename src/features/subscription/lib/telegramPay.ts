type InvoiceStatus = 'paid' | 'cancelled' | 'failed' | 'pending';

type TelegramWebApp = {
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
  openInvoice?: (url: string, callback?: (status: InvoiceStatus) => void) => void;
};

function webApp(): TelegramWebApp | undefined {
  return (window as Window & { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;
}

export function openExternal(url: string) {
  const app = webApp();
  if (app?.openLink) {
    app.openLink(url);
    return;
  }
  window.open(url, '_blank', 'noopener');
}

export function openInvoice(url: string): Promise<InvoiceStatus> {
  const app = webApp();
  if (!app?.openInvoice) return Promise.resolve('failed');
  return new Promise((resolve) => {
    app.openInvoice?.(url, (status) => resolve(status));
  });
}
