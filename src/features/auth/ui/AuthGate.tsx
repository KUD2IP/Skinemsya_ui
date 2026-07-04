import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PaperPlaneTilt, WarningCircle } from '@phosphor-icons/react';
import { AppSplash } from '@/app/AppSplash';
import { useSessionStore } from '../model/session.store';
import { getInitDataRaw } from '../lib/initData';
import { appReveal, splashScreen, usePrefersReducedMotion } from '@/shared/lib';
import { Button, EmptyState, Icon } from '@/shared/ui';
import * as css from './AuthGate.css';

const MIN_SPLASH_MS = 1100;

type Phase = 'starting' | 'authenticated' | 'no-telegram' | 'failed';

export interface AuthGateProps {
  children: ReactNode;
}

/** Splash при каждом запуске / обновлении → плавный переход в приложение. */
export function AuthGate({ children }: AuthGateProps) {
  const status = useSessionStore((s) => s.status);
  const login = useSessionStore((s) => s.login);
  const [phase, setPhase] = useState<Phase>('starting');
  const startedAt = useRef(Date.now());
  const reduced = usePrefersReducedMotion();

  const authenticate = async () => {
    const initData = getInitDataRaw();
    if (!initData) {
      const elapsed = Date.now() - startedAt.current;
      if (elapsed < MIN_SPLASH_MS) {
        await new Promise((r) => setTimeout(r, MIN_SPLASH_MS - elapsed));
      }
      setPhase('no-telegram');
      return;
    }
    const ok = await login(initData);
    const elapsed = Date.now() - startedAt.current;
    if (elapsed < MIN_SPLASH_MS) {
      await new Promise((r) => setTimeout(r, MIN_SPLASH_MS - elapsed));
    }
    setPhase(ok ? 'authenticated' : 'failed');
  };

  useEffect(() => {
    void authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showSplash = phase === 'starting';

  return (
    <>
      <AnimatePresence>
        {showSplash ? (
          <motion.div
            key="boot-splash"
            className={css.bootOverlay}
            variants={reduced ? undefined : splashScreen}
            initial={reduced ? false : 'initial'}
            animate={reduced ? undefined : 'animate'}
            exit={reduced ? undefined : 'exit'}
          >
            <AppSplash layout="fill" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      {phase === 'authenticated' ? (
        <motion.div
          className={css.bootApp}
          variants={reduced ? undefined : appReveal}
          initial={reduced ? false : 'initial'}
          animate={reduced ? undefined : 'animate'}
        >
          {children}
        </motion.div>
      ) : null}

      {phase === 'no-telegram' ? (
        <motion.div
          className={css.bootApp}
          variants={reduced ? undefined : appReveal}
          initial={reduced ? false : 'initial'}
          animate={reduced ? undefined : 'animate'}
        >
          <EmptyState
            icon={<Icon icon={PaperPlaneTilt} size="lg" />}
            title="Откройте в Telegram"
            description="Это мини-приложение работает внутри Telegram. Запустите его через бота, чтобы войти."
          />
        </motion.div>
      ) : null}

      {phase === 'failed' ? (
        <motion.div
          className={css.bootApp}
          variants={reduced ? undefined : appReveal}
          initial={reduced ? false : 'initial'}
          animate={reduced ? undefined : 'animate'}
        >
          <EmptyState
            icon={<Icon icon={WarningCircle} size="lg" />}
            title="Не удалось войти"
            description={useSessionStore.getState().error ?? 'Попробуйте перезапустить приложение.'}
            actions={
              <Button
                variant="secondary"
                loading={status === 'authenticating'}
                onClick={() => {
                  startedAt.current = Date.now();
                  setPhase('starting');
                  void authenticate();
                }}
              >
                Повторить
              </Button>
            }
          />
        </motion.div>
      ) : null}
    </>
  );
}
