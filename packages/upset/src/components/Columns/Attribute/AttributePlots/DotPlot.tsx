import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { ScaleLinear } from 'd3';
import { Aggregate, SixNumberSummary, Subset } from '@visdesignlab/upset2-core';
import { dimensionsSelector } from '../../../../atoms/dimensionsAtom';
import { visibleAttributesSelector } from '../../../../atoms/config/visibleAttributes';

type Props = {
  scale: ScaleLinear<number, number, never>;
  values: number[];
  attribute: string;
  summary: SixNumberSummary;
  isAggregate: boolean;
  row: Subset | Aggregate;
};

// Dot plot component for the attributes plots
export const DotPlot: FC<Props> = ({
  scale, values, attribute, summary, isAggregate, row,
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
      {values.map((value, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <circle key={`${row.id} + ${idx}`} cx={scale(value)} cy={0} r={dimensions.attribute.dotSize} fill="black" opacity="0.4" />
      ))}
    </g>
  );
};
