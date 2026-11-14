import { Accordion } from '@ark-ui/react/accordion';
import { Plus } from '@phosphor-icons/react';
import { LandingReveal } from '../components/LandingReveal';
import { LandingSection } from '../components/LandingSection';
import * as css from './LandingFinePrint.css';

const ITEMS = [
  {
    value: 'install',
    q: 'Нужно что-то устанавливать?',
    a: 'Нет. Скинемся открывается внутри Telegram — без магазина приложений и отдельной регистрации.',
  },
  {
    value: 'unequal',
    q: 'Как делить не поровну?',
    a: 'Каждый отмечает свои позиции. Общее помечается «На всех» и делится автоматически — чаевые так же.',
  },
  {
    value: 'money',
    q: 'Как переводят деньги?',
    a: 'Обычным переводом через банк. Реквизиты плательщика уже на экране, сервис не принимает деньги участников.',
  },
  {
    value: 'confirmation',
    q: 'Кто подтверждает перевод?',
    a: 'Плательщик. После перевода участник нажимает «Отправил», а плательщик подтверждает получение или отмечает проблему.',
  },
] as const;

export function LandingFinePrint() {
  return (
    <LandingSection id="details">
      <LandingReveal>
        <div className={css.head}>
          <p className={css.kicker}>Без мелкого шрифта</p>
          <h2 className={css.title}>Коротко о важном</h2>
        </div>
      </LandingReveal>
      <LandingReveal>
        <Accordion.Root className={css.root} collapsible>
          {ITEMS.map((item) => (
            <Accordion.Item className={css.item} value={item.value} key={item.value}>
              <Accordion.ItemTrigger className={css.trigger}>
                <span>{item.q}</span>
                <Accordion.ItemIndicator className={css.indicator}>
                  <Plus size={20} weight="bold" aria-hidden />
                </Accordion.ItemIndicator>
              </Accordion.ItemTrigger>
              <Accordion.ItemContent className={css.content}>
                <p className={css.answer}>{item.a}</p>
              </Accordion.ItemContent>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </LandingReveal>
    </LandingSection>
  );
}
