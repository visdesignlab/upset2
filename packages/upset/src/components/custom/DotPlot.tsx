import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { ScaleLinear } from 'd3';
import { FiveNumberSummary } from '@visdesignlab/upset2-core';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { visibleAttributesSelector } from '../../atoms/config/visibleAttributes';
import translate from '../../utils/transform';

type Props = {
  scale: ScaleLinear<number, number, never>;
  values: number[];
  attribute: string;
  summary: FiveNumberSummary;
  isAggregate: boolean;
};

export const DotPlot: FC<Props> = ({
  scale, values, attribute, summary, isAggregate,
}) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const attributes = useRecoilValue(visibleAttributesSelector);

  if (summary.max === undefined || summary.min === undefined || summary.first === undefined || summary.third === undefined || summary.median === undefined) {
    return null;
  }

  return (
    <g>
      <rect
        fill="#ccc"
        opacity={attributes.indexOf(attribute) % 2 === 1 ? 0.0 : (isAggregate ? 0.4 : 0.2)}
        width={dimensions.attribute.width + dimensions.attribute.dotSize * 2}
        height={dimensions.attribute.plotHeight}
        x={-(dimensions.attribute.dotSize)}
        y={-(dimensions.attribute.plotHeight / 2)}
      />
      {values.map((value) => (
        <circle cx={scale(value)} cy={0} r={dimensions.attribute.dotSize} fill="black" opacity="0.4" />
      ))}
    </g>
  );
};
