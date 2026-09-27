import { useRef } from 'react';
import { LandingBar } from './sections/LandingBar';
import { LandingFinePrint } from './sections/LandingFinePrint';
import { LandingFooter } from './sections/LandingFooter';
import { LandingHero } from './sections/LandingHero';
import { LandingStory } from './sections/LandingStory';
import { LandingScrollContext } from './lib/scrollRoot';
import * as css from './LandingPage.css';

/** Лендинг для пользователей в обычном браузере (вне Telegram Mini App). */
export function LandingPage() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <LandingScrollContext.Provider value={scrollRef}>
      <div className={css.shell}>
        <LandingBar />
        <div className={css.root} id="top" ref={scrollRef}>
          <main className={css.inner}>
            <LandingHero />
            <LandingStory />
            <LandingFinePrint />
            <LandingFooter />
          </main>
        </div>
      </div>
    </LandingScrollContext.Provider>
  );
}
