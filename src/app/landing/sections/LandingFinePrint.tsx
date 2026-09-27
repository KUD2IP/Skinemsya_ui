import { LandingReveal } from '../components/LandingReveal';
import { LandingSection } from '../components/LandingSection';
import * as css from './LandingFinePrint.css';

const ITEMS = [
  {
    q: 'Нужно что-то устанавливать?',
    a: 'Нет. Скинемся открывается внутри Telegram как Mini App — без магазина приложений и отдельной регистрации.',
  },
  {
    q: 'Почему именно Telegram?',
    a: 'Компания уже в чате. Бот приходит туда, где договариваются об ужине, а не зовёт всех в новое приложение.',
  },
  {
    q: 'Как делить не поровну?',
    a: 'Каждый отмечает свои позиции. Общее помечается «На всех» и делится автоматически — чаевые так же.',
  },
  {
    q: 'Как именно отдают деньги?',
    a: 'Перевод обычный, через банк: реквизиты плательщика уже на экране. После перевода жмёте «Отправил».',
  },
  {
    q: 'А если кто-то ещё не выбрал?',
    a: 'Его доля появится, когда он закончит выбор. Остальные уже видят свои суммы и могут переводить — ждать всех не нужно.',
  },
  {
    q: 'Кто подтверждает, что деньги пришли?',
    a: 'Плательщик. Статусы простые: не скинул, ждёт проверки, подтверждено. Если перевод не дошёл — «Не пришло».',
  },
] as const;

export function LandingFinePrint() {
  return (
    <LandingSection id="details">
      <LandingReveal>
        <div className={css.head}>
          <h2 className={css.title}>Подробности</h2>
        </div>
      </LandingReveal>
      <LandingReveal>
        <div className={css.grid}>
          {ITEMS.map((item) => (
            <div className={css.item} key={item.q}>
              <p className={css.question}>{item.q}</p>
              <p className={css.answer}>{item.a}</p>
            </div>
          ))}
        </div>
      </LandingReveal>
    </LandingSection>
  );
}
