import { SUBSCRIPTION_PERIOD_DAYS, SUBSCRIPTION_PRICE_KOPECKS, sellerRequisitesLine } from '@/shared/config';
import { formatMoney } from '@/shared/lib';
import { LandingSection } from '../components/LandingSection';
import * as css from './LandingSubscription.css';

export function LandingSubscription() {
  const price = formatMoney(SUBSCRIPTION_PRICE_KOPECKS);

  return (
    <LandingSection id="subscription">
      <div className={css.card}>
        <p className={css.kicker}>Платная услуга</p>
        <h2 className={css.title}>Чтение фото чека</h2>
        <p className={css.price}>
          {price} за {SUBSCRIPTION_PERIOD_DAYS} дней
        </p>
        <p className={css.text}>
          По снимку кассового чека или пречека блюда появляются в сборе. Чтение фото доступно
          после оплаты подписки. Делить счёт и вписывать блюда вручную можно бесплатно, эти
          переводы идут напрямую в банке.
        </p>
        <p className={css.text}>
          После оплаты услуга открывается в том же мини-приложении Telegram. Доставки нет: это
          цифровой доступ на {SUBSCRIPTION_PERIOD_DAYS} дней.
        </p>
        <p className={css.seller}>{sellerRequisitesLine()}</p>
        <a className={css.link} href="/legal">
          Оферта и реквизиты
        </a>
      </div>
    </LandingSection>
  );
}
