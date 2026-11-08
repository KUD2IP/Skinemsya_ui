/** Продавец подписки на чтение чека. ИНН самозанятого — 12 цифр, без пробелов. */
export const SELLER_NAME =
  import.meta.env.VITE_SELLER_NAME?.trim() || 'Сторожев Иван Андреевич';

export const SELLER_INN = import.meta.env.VITE_SELLER_INN?.trim() || '100123256340';

export const SELLER_PHONE = import.meta.env.VITE_SELLER_PHONE?.trim() || '+79278941822';

export const SELLER_EMAIL = import.meta.env.VITE_SELLER_EMAIL?.trim() || 'ivan@kudzip.ru';

/** Публичный адрес для писем. Домашний адрес сюда не подставляется. */
export const SELLER_ADDRESS = import.meta.env.VITE_SELLER_ADDRESS?.trim() || '';

export function formatSellerPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 11 && (digits.startsWith('7') || digits.startsWith('8'))) {
    const rest = digits.slice(1);
    return `+7 ${rest.slice(0, 3)} ${rest.slice(3, 6)}-${rest.slice(6, 8)}-${rest.slice(8)}`;
  }
  return phone;
}

/** Цена подписки на чтение фото чека. Совпадает с SUBSCRIPTION_PRICE_KOPECKS на бэкенде. */
export const SUBSCRIPTION_PRICE_KOPECKS = 4900;

export const SUBSCRIPTION_PERIOD_DAYS = 30;

export function sellerRequisitesLine(): string {
  const inn = SELLER_INN ? `, ИНН ${SELLER_INN}` : '';
  return `Самозанятый ${SELLER_NAME}${inn}`;
}
