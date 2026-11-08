const SCRIPT = 'https://yookassa.ru/checkout-widget/v1/checkout-widget.js';

type WidgetInstance = {
  render: (containerId: string) => void;
  destroy: () => void;
  on: (event: 'complete' | 'success' | 'fail', handler: () => void) => void;
};

type WidgetConstructor = new (options: {
  confirmation_token: string;
  return_url?: string;
  customization?: {
    payment_methods?: string[];
    colors?: {
      control_primary?: string;
      control_primary_content?: string;
      control_secondary?: string;
      background?: string;
      text?: string;
      border?: string;
    };
  };
  error_callback?: (error: { error?: string }) => void;
}) => WidgetInstance;

function widgetConstructor(): WidgetConstructor | undefined {
  return (window as Window & { YooMoneyCheckoutWidget?: WidgetConstructor }).YooMoneyCheckoutWidget;
}

export function loadYooKassaWidget(): Promise<void> {
  if (widgetConstructor()) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-yookassa-widget]');
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Не удалось открыть оплату')), {
        once: true,
      });
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT;
    script.async = true;
    script.dataset.yookassaWidget = 'true';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Не удалось открыть оплату'));
    document.head.appendChild(script);
  });
}

export function mountYooKassaWidget(
  token: string,
  containerId: string,
  onComplete: () => void,
  onError: () => void,
): () => void {
  const Ctor = widgetConstructor();
  if (!Ctor) {
    onError();
    return () => {};
  }
  const widget = new Ctor({
    confirmation_token: token,
    return_url: window.location.href,
    customization: {
      payment_methods: ['bank_card', 'yoo_money', 'tinkoff_bank'],
      colors: {
        control_primary: '#21A038',
        control_primary_content: '#FFFFFF',
        control_secondary: '#F4F7F5',
        background: '#FFFFFF',
        text: '#06120C',
        border: '#E4EAE7',
      },
    },
    error_callback: () => onError(),
  });
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    onComplete();
  };
  widget.on('complete', finish);
  widget.on('success', finish);
  widget.on('fail', () => onError());
  widget.render(containerId);
  return () => widget.destroy();
}
