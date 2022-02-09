import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { useScale } from '../hooks/useScale';
import translate from '../utils/transform';
import { Axis } from './Axis';

type Props = {
  domain: [number, number];
  tickFormatter?: (value: number) => string | number;
};

const defaultTickFormatter = (d: number) => {
  if (d >= 1000000) return `${d.toString()[0]}e${d.toString().length - 1}`;

  if (d >= 500000) return `${(d as number) / 100000}M`;

  if (d >= 1000) return `${(d as number) / 1000}K`;

  return d;
};

export const AttributeScale: FC<Props> = ({
  domain,
  tickFormatter = defaultTickFormatter,
}) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const scale = useScale(domain, [0, dimensions.header.attribute.width]);

  return (
    <g
      transform={translate(
        0,
        dimensions.header.attribute.buttonHeight +
          dimensions.header.attribute.gap,
      )}
    >
      <Axis
        scale={scale}
        fontSize={0.8}
        type="top"
        margin={0}
        showLabel={false}
        label=""
        tickFormatter={tickFormatter}
      />
    </g>
  );
};
