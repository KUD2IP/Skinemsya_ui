import {
  formatSellerPhone,
  SELLER_ADDRESS,
  SELLER_EMAIL,
  SELLER_INN,
  SELLER_NAME,
  SELLER_PHONE,
  SUBSCRIPTION_PERIOD_DAYS,
  SUBSCRIPTION_PRICE_KOPECKS,
  SUPPORT_EMAIL,
  TELEGRAM_CHANNEL_URL,
} from '@/shared/config';
import { formatMoney } from '@/shared/lib';
import * as landing from '@/app/landing/LandingPage.css';
import * as css from './LegalPage.css';

const PRICE = formatMoney(SUBSCRIPTION_PRICE_KOPECKS);
const EMAIL = SELLER_EMAIL || SUPPORT_EMAIL;

export function LegalPage() {
  return (
    <div className={landing.shell}>
      <header className={css.top}>
        <a className={css.back} href="/">
          Скинемся
        </a>
      </header>
      <div className={landing.root}>
        <main className={landing.inner}>
          <article className={css.article}>
            <h1 className={css.title}>Услуга, оферта и реквизиты</h1>
            <p className={css.lead}>
              Через ЮKassa принимается один платёж: подписка на чтение фото чека. Деление счёта
              между участниками ужина бесплатно и идёт обычным переводом в банке.
            </p>

            <section>
              <h2 className={css.sectionTitle}>Услуга и цена</h2>
              <p className={css.price}>
                {PRICE} за {SUBSCRIPTION_PERIOD_DAYS} дней
              </p>
              <p className={css.text}>
                Название: чтение фото чека. По фото кассового чека или пречека в мини-приложении
                «Скинемся» появляются блюда и товары: название, количество и цена. Подписка
                действует {SUBSCRIPTION_PERIOD_DAYS} дней и не ограничена одним снимком. Цена
                фиксированная, {PRICE}.
              </p>
            </section>

            <section>
              <h2 className={css.sectionTitle}>Как получить услугу</h2>
              <p className={css.text}>
                Это цифровая услуга, доставки и самовывоза нет. После подтверждения оплаты
                распознавание включается в том же мини-приложении Telegram, из аккаунта, которым
                заплатили. Обычно это несколько секунд. Дальше человек снимает чек целиком, и
                позиции появляются в черновике сбора. Карта и СБП оплачивают один период на{' '}
                {SUBSCRIPTION_PERIOD_DAYS} дней. Подписка звёздами Telegram продлевается, пока её не
                отменят в профиле.
              </p>
            </section>

            <section>
              <h2 className={css.sectionTitle}>Публичная оферта</h2>
              <ol className={css.list}>
                <li>
                  Продавец — самозанятый {SELLER_NAME}, ИНН {SELLER_INN}. Применяется налог на
                  профессиональный доход, НДС не облагается.
                </li>
                <li>
                  Услуга — доступ к чтению фото чека в мини-приложении «Скинемся» на{' '}
                  {SUBSCRIPTION_PERIOD_DAYS} дней.
                </li>
                <li>Цена — {PRICE} за {SUBSCRIPTION_PERIOD_DAYS} дней. Других платных услуг нет.</li>
                <li>
                  Оплата картой или через СБП означает согласие с этой офертой. Платёж проводит
                  ЮKassa, покупателю приходит чек.
                </li>
                <li>
                  Услуга оказывается электронно в мини-приложении сразу после подтверждения
                  платежа. Физическая доставка не производится.
                </li>
                <li>
                  Оплата картой или через СБП даёт доступ на {SUBSCRIPTION_PERIOD_DAYS} дней. Следующий
                  период начинается после новой оплаты. Подписка звёздами Telegram продлевается,
                  пока покупатель не отменит её в профиле. Оплаченные дни сохраняются до конца
                  периода.
                </li>
              </ol>
            </section>

            <section className={css.requisites} aria-label="Контакты и реквизиты">
              <span className={css.requisiteLabel}>Продавец</span>
              <span className={css.requisiteValue}>{SELLER_NAME}</span>
              <span className={css.requisiteLabel}>Статус</span>
              <span className={css.requisiteValue}>Самозанятый</span>
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
              <span className={css.requisiteLabel}>Telegram</span>
              <span className={css.requisiteValue}>
                <a href={TELEGRAM_CHANNEL_URL}>{TELEGRAM_CHANNEL_URL}</a>
              </span>
            </section>
          </article>
        </main>
      </div>
    </div>
  );
}
