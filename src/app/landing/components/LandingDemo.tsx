import { DemoScenario, type DemoScenarioVariant } from '@/app/demo/DemoScenario';
import { eventStatusLabel } from '@/shared/lib';
import { mockEvent } from '../lib/mockEvent';
import { LandingDemoFrame } from './LandingDemoFrame';

export type LandingDemoVariant = DemoScenarioVariant;

export interface LandingDemoProps {
  variant: LandingDemoVariant;
}

export function LandingDemo({ variant }: LandingDemoProps) {
  const status = variant === 'positions' ? 'DRAFT' : variant === 'picks' ? 'DISTRIBUTION' : 'CALCULATED';
  const event = mockEvent(status);

  return (
    <LandingDemoFrame
      title={event.name}
      subtitle={variant === 'pay' ? 'Скинуть' : eventStatusLabel(status)}
    >
      <DemoScenario variant={variant} />
    </LandingDemoFrame>
  );
}
