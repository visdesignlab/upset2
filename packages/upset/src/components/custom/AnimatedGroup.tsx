import { ComponentType, PropsWithChildren, SVGProps } from 'react';
import { a } from 'react-spring';

type AnimatedGroupProps = PropsWithChildren<
  Omit<SVGProps<SVGGElement>, 'transform'> & {
    transform?: unknown;
  }
>;

export const AnimatedGroup = a.g as unknown as ComponentType<AnimatedGroupProps>;
