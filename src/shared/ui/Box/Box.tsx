import { forwardRef } from 'react';
import type { CSSProperties, ElementType, ReactNode } from 'react';
import { vars } from '@/shared/theme';

type SpaceToken = keyof typeof vars.space;

export interface StackProps {
  as?: ElementType;
  direction?: 'row' | 'column';
  gap?: SpaceToken;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  wrap?: boolean;
  flex?: CSSProperties['flex'];
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
}

/** Гибкий layout-примитив на flex c gap из токенов. */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  {
    as: Tag = 'div',
    direction = 'column',
    gap = 0,
    align,
    justify,
    wrap,
    flex,
    style,
    className,
    children,
  },
  ref,
) {
  const Component = Tag as ElementType;
  return (
    <Component
      ref={ref}
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction,
        gap: vars.space[gap],
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? 'wrap' : undefined,
        flex,
        minWidth: 0,
        ...style,
      }}
    >
      {children}
    </Component>
  );
});
