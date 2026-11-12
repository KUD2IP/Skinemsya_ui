import {
  SELLER_ADDRESS,
  SELLER_EMAIL,
  SELLER_INN,
  SELLER_NAME,
  SELLER_PHONE,
  SUPPORT_EMAIL,
  TELEGRAM_CHANNEL_URL,
  formatSellerPhone,
} from '@/shared/config';
import * as css from './LegalPage.css';

const EMAIL = SELLER_EMAIL || SUPPORT_EMAIL;

export function Requisites() {
  return (
    <section className={css.requisites} aria-label="Реквизиты">
      <span className={css.requisiteLabel}>Продавец и оператор</span>
      <span className={css.requisiteValue}>{SELLER_NAME}</span>
      <span className={css.requisiteLabel}>Статус</span>
      <span className={css.requisiteValue}>Самозанятый, налог на профессиональный доход</span>
      <span className={css.requisiteLabel}>ИНН</span>
      <span className={css.requisiteValue}>{SELLER_INN}</span>
      {SELLER_PHONE ? (
        <>
          <span className={css.requisiteLabel}>Телефон</span>
          <span className={css.requisiteValue}>
            <a href={`tel:${SELLER_PHONE}`}>{formatSellerPhone(SELLER_PHONE)}</a>
          </span>
        </>
      ) : null}
      {EMAIL ? (
        <>
          <span className={css.requisiteLabel}>Электронная почта</span>
          <span className={css.requisiteValue}>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </span>
        </>
      ) : null}
      {SELLER_ADDRESS ? (
        <>
          <span className={css.requisiteLabel}>Почтовый адрес</span>
          <span className={css.requisiteValue}>{SELLER_ADDRESS}</span>
        </>
      ) : null}
      <span className={css.requisiteLabel}>Канал</span>
      <span className={css.requisiteValue}>
        <a href={TELEGRAM_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
          {TELEGRAM_CHANNEL_URL}
        </a>
      </span>
    </section>
  );
}
