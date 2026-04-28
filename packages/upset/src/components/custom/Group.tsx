import { SVGProps } from 'react';

import translate from '../../utils/transform';

type Props = SVGProps<SVGGElement> & {
  tx?: number;
  ty?: number;
};

// Custom component for grouping SVG elements with a transform
function Group(props: Props) {
  const {
    tx = 0, ty = tx, children, ...base
  } = props;

  return (
    <g {...base} transform={translate(tx, ty)}>
      {children}
    </g>
  );
}

export default Group;
