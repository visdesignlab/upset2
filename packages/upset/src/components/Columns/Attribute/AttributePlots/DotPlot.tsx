import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { ScaleLinear } from 'd3-scale';
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
  jitter?: boolean;
};

// Dot plot component for the attributes plots
export const DotPlot: FC<Props> = ({
  scale, values, attribute, summary, isAggregate, row, jitter = false,
}) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const attributes = useRecoilValue(visibleAttributesSelector);

  if (summary.max === undefined || summary.min === undefined || summary.first === undefined || summary.third === undefined || summary.median === undefined) {
    return null;
  }

  /**
   * Generates a y offset for the provided index.
   * Seeded based on row size so that jitter is consistent between renders, and also varies between rows.
   * Rows of the same size will have the same jitter.
   * @param index The index of the dot being rendered
   * @returns y offset for the dot based on the index and row size
   */
  function getJitterForIndex(index: number) {
    const seed = row.size + index;

    /**
     * Generates a random number between 0 and 1 using a seed value.
     * Poor randomness approximation, but good enough for jittering.
     * @returns A random number between 0 and 1.
     */
    function random() {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    }

    return (dimensions.attribute.plotHeight / 4) * (1 - random() * 2);
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
        <circle key={`${row.id} + ${idx}`} cx={scale(value)} cy={jitter ? getJitterForIndex(idx) : 0} r={dimensions.attribute.dotSize} fill="black" opacity="0.2" />
      ))}
    </g>
  );
};
