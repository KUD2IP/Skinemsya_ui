import { SUBSCRIPTION_PERIOD_DAYS, SUBSCRIPTION_PRICE_KOPECKS } from '@/shared/config';
import { formatMoney } from '@/shared/lib';
import { LandingCta } from '../components/LandingCta';
import { LandingSection } from '../components/LandingSection';
import * as css from './LandingSubscription.css';

export function LandingSubscription() {
  const price = formatMoney(SUBSCRIPTION_PRICE_KOPECKS);

  return (
    <LandingSection id="subscription">
      <div className={css.card}>
        <div className={css.main}>
          <p className={css.kicker}>Прозрачные условия</p>
          <h2 className={css.title}>Делить счёт — бесплатно.</h2>
          <p className={css.text}>
            Создание сбора, выбор позиций, расчёт долей и подтверждение переводов доступны без
            оплаты. Деньги участников идут напрямую через банк.
          </p>
          <div className={css.cta}>
            <LandingCta size="lg" showHint={false} fullWidth />
            <p className={css.hint}>Откроется мини-приложение в Telegram</p>
          </div>
        </div>
        <div className={css.option}>
          <p className={css.optionLabel}>Дополнительно</p>
          <h3 className={css.optionTitle}>Чтение фото чека</h3>
          <p className={css.price}>
            {price}{' '}
            <span className={css.pricePeriod}>на {SUBSCRIPTION_PERIOD_DAYS} дней</span>
          </p>
          <p className={css.optionText}>
            Блюда появятся в сборе по снимку кассового чека или пречека. Если фото нет, все позиции
            можно добавить вручную — это останется бесплатным.
          </p>
        </div>
      </div>
    </LandingSection>
  );
}
