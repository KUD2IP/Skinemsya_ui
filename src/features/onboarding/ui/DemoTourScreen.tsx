import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';
import { DemoScenario, type DemoScenarioVariant } from '@/app/demo/DemoScenario';
import { cx, fade, haptics } from '@/shared/lib';
import { Button, Card, Screen, ScreenBack } from '@/shared/ui';
import * as css from './DemoTourScreen.css';

const steps: Array<{
  variant: DemoScenarioVariant;
  title: string;
  description: string;
}> = [
  {
    variant: 'positions',
    title: 'Соберите позиции',
    description: 'Загрузите чек или добавьте блюда вручную. Для разового ужина группа не нужна.',
  },
  {
    variant: 'picks',
    title: 'Каждый выбирает своё',
    description: 'Пригласите участников защищённой ссылкой. Общие позиции разделятся автоматически.',
  },
  {
    variant: 'pay',
    title: 'Участник отмечает перевод',
    description: 'Сумма и реквизиты уже на экране. Скриншот перевода можно приложить, но это необязательно.',
  },
  {
    variant: 'payer',
    title: 'Плательщик проверяет',
    description: 'Он подтверждает поступления и закрывает сбор. Видно, кто уже скинулся и кого стоит напомнить.',
  },
];

export function DemoTourScreen() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const finish = () => {
    haptics.success();
    void navigate({ to: '/' });
  };

  const advance = () => {
    if (isLast) {
      finish();
      return;
    }
    haptics.tap();
    setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  };

  const rewind = () => {
    if (stepIndex === 0) return;
    haptics.tap();
    setStepIndex((current) => Math.max(0, current - 1));
  };

  return (
    <Screen
      title="Как это работает"
      subtitle={`Шаг ${stepIndex + 1} из ${steps.length}`}
      headerLeading={<ScreenBack onBack={() => void navigate({ to: '/' })} />}
      headerAction={
        <Button type="button" variant="ghost" size="sm" onClick={() => void navigate({ to: '/' })}>
          Пропустить
        </Button>
      }
    >
      <div className={css.tour}>
        <div className={css.progress} aria-label={`Шаг ${stepIndex + 1} из ${steps.length}`}>
          {steps.map((item, index) => (
            <button
              key={item.variant}
              type="button"
              className={css.progressButton}
              aria-label={`Шаг ${index + 1}: ${item.title}`}
              aria-current={index === stepIndex ? 'step' : undefined}
              onClick={() => setStepIndex(index)}
            >
              <span className={css.progressSegment({ active: index <= stepIndex })} />
            </button>
          ))}
        </div>

        <div className={css.stage}>
          <Card padding="lg">
            <span className={css.eyebrow}>Пример · без сохранения данных</span>
            <h2 className={css.stepTitle}>{step.title}</h2>
            <p className={css.stepDescription}>{step.description}</p>
          </Card>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step.variant}
              variants={fade}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <DemoScenario variant={step.variant} onAdvance={advance} />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            className={cx(css.tapZone, css.tapBack)}
            aria-label="Предыдущий шаг"
            disabled={stepIndex === 0}
            onClick={rewind}
          />
          <button
            type="button"
            className={cx(css.tapZone, css.tapForward)}
            aria-label={isLast ? 'Перейти к сборам' : 'Следующий шаг'}
            onClick={advance}
          />
        </div>
      </div>
    </Screen>
  );
}
