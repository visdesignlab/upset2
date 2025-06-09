import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { ScaleLinear } from 'd3-scale';
import { Aggregate, Subset } from '@visdesignlab/upset2-core';
import { dimensionsSelector } from '../../../../atoms/dimensionsAtom';
import { visibleAttributesSelector } from '../../../../atoms/config/visibleAttributes';

/**
 * Props for the DotPlot component.
 */
type Props = {
  /**
   * The scale for mapping attribute values to x-axis positions.
   */
  scale: ScaleLinear<number, number, never>;
  /**
   * Array of attribute values to plot.
   */
  values: number[];
  /**
   * The attribute name.
   */
  attribute: string;
  /**
   * Indicates whether the attribute is an aggregate.
   */
  isAggregate: boolean;
  /**
   * The row object. Rows can be either Subsets or Aggregates.
   */
  row: Subset | Aggregate;
  /**
   * Whether to jitter the dots
   */
  jitter?: boolean;
};

/**
 * Renders a Dot Plot for a given attribute.
 *
 * @component
 * @param {Props} props - The component props.
 * @param {number} props.scale - The scale for mapping attribute values to x-axis positions.
 * @param {number[]} props.values - The array of attribute values to plot.
 * @param {string} props.attribute - The attribute name.
 * @param {boolean} props.isAggregate - Indicates whether the row is an aggregate.
 * @param {Row} props.row - The row object. Rows can be either Subsets or Aggregates.
 * @param {boolean} props.jitter - Whether to jitter the dots.
 * @returns {JSX.Element} The rendered dot plot.
 */
export const DotPlot: FC<Props> = ({
  scale,
  values,
  attribute,
  isAggregate,
  row,
  jitter = false,
}) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const attributes = useRecoilValue(visibleAttributesSelector);

  /**
   * Generates a y offset for the provided index.
   * Seeded based on row size and length of row id so that jitter is consistent between renders, and also varies between rows.
   * Rows of the same size AND same id string length will have the same jitter.
   * @param index The index of the dot being rendered
   * @returns y offset for the dot based on the index and row size
   */
  function getJitterForIndex(index: number) {
    const seed = row.size + row.id.length + index;

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
        opacity={attributes.indexOf(attribute) % 2 === 1 ? 0.0 : isAggregate ? 0.4 : 0.2}
        width={dimensions.attribute.width + dimensions.attribute.dotSize * 2}
        height={dimensions.attribute.plotHeight}
        x={-dimensions.attribute.dotSize}
        y={-(dimensions.attribute.plotHeight / 2)}
      />
      {values.map((value, idx) => (
        // There is no unique identifier for the attribute values other than index, so it is used as key

        <circle
          key={`${row.id} + ${idx}`}
          cx={scale(value)}
          cy={jitter ? getJitterForIndex(idx) : 0}
          r={dimensions.attribute.dotSize}
          fill="black"
          opacity="0.2"
        />
      ))}
    </g>
  );
};
