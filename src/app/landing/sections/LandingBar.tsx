import { LandingCta } from '../components/LandingCta';
import { LandingMark } from '../components/LandingMark';
import * as css from './LandingBar.css';

const LINKS = [
  { href: '#story', label: 'Как это работает' },
  { href: '#details', label: 'Подробности' },
] as const;

export function LandingBar() {
  return (
    <header className={css.root}>
      <div className={css.inner}>
        <a className={css.brand} href="#top">
          <LandingMark />
          <span className={css.wordmark}>Скинемся</span>
        </a>
        <nav className={css.nav} aria-label="Разделы">
          {LINKS.map((link) => (
            <a key={link.href} className={css.navLink} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className={css.ctaCol}>
          <div className={css.ctaNarrow}>
            <LandingCta compact size="sm" showHint={false} fullWidth />
          </div>
          <div className={css.ctaWide}>
            <LandingCta size="md" showHint={false} fullWidth />
          </div>
        </div>
      </div>
    </header>
  );
}
