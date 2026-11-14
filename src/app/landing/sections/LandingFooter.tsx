import {
  SUPPORT_EMAIL,
  TELEGRAM_CHANNEL_URL,
  getTelegramChannelHandle,
  getTelegramOpenUrl,
  sellerRequisitesLine,
} from '@/shared/config';
import { LandingMark } from '../components/LandingMark';
import { useLandingScrollToTop } from '../lib/scrollRoot';
import * as css from './LandingFooter.css';

const PAGE_LINKS = [
  { href: '#story', label: 'Как это работает' },
  { href: '#details', label: 'Вопросы' },
  { href: '#subscription', label: 'Стоимость' },
] as const;

interface ContactLink {
  label: string;
  href: string;
  external?: boolean;
  value?: string;
}

function contactLinks(): ContactLink[] {
  const links: ContactLink[] = [];
  const botUrl = getTelegramOpenUrl();
  if (botUrl) {
    links.push({ label: 'Бот в Telegram', href: botUrl, external: true });
  }
  if (TELEGRAM_CHANNEL_URL) {
    links.push({
      label: 'Канал',
      href: TELEGRAM_CHANNEL_URL,
      external: true,
      value: getTelegramChannelHandle(TELEGRAM_CHANNEL_URL) ?? undefined,
    });
  }
  if (SUPPORT_EMAIL) {
    links.push({ label: 'Почта', href: `mailto:${SUPPORT_EMAIL}`, value: SUPPORT_EMAIL });
  }
  return links;
}

export function LandingFooter() {
  const contacts = contactLinks();
  const year = new Date().getFullYear();
  const scrollToTop = useLandingScrollToTop();

  return (
    <footer className={css.root}>
      <div className={contacts.length > 0 ? css.grid : css.gridShort}>
        <div className={css.brandCol}>
          <a className={css.brand} href="#top">
            <LandingMark />
            <span className={css.brandName}>Скинемся</span>
          </a>
          <p className={css.brandText}>
            Один чек, понятные доли и подтверждённые переводы. Всё внутри Telegram.
          </p>
        </div>

        <nav className={css.col} aria-label="Разделы">
          <p className={css.colTitle}>Разделы</p>
          {PAGE_LINKS.map((link) => (
            <a key={link.href} className={css.link} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        {contacts.length > 0 ? (
          <div className={css.col}>
            <p className={css.colTitle}>Контакты</p>
            {contacts.map((contact) => (
              <a
                key={contact.label}
                className={css.link}
                href={contact.href}
                {...(contact.external
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
              >
                {contact.value ? (
                  <>
                    <span className={css.linkLabel}>{contact.label}</span>
                    <span className={css.linkValue}>{contact.value}</span>
                  </>
                ) : (
                  contact.label
                )}
              </a>
            ))}
          </div>
        ) : null}
      </div>

      <div className={css.legal}>
        <span>© {year} Скинемся</span>
        <span>{sellerRequisitesLine()}</span>
        <a className={css.legalLink} href="/legal/offer">
          Оферта
        </a>
        <a className={css.legalLink} href="/legal/privacy">
          Конфиденциальность
        </a>
        <a className={css.legalLink} href="#top" onClick={scrollToTop}>
          Наверх
        </a>
      </div>
    </footer>
  );
}
