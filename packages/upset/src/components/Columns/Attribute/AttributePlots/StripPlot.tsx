import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { ScaleLinear } from 'd3-scale';
import { Aggregate, Subset } from '@visdesignlab/upset2-core';
import { dimensionsSelector } from '../../../../atoms/dimensionsAtom';
import { visibleAttributesSelector } from '../../../../atoms/config/visibleAttributes';

/**
 * Props for the StripPlot component.
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
};

/**
 * Renders a strip plot for a given attribute.
 *
 * @component
 * @param {Props} props - The component props.
 * @param {number} props.scale - The scale for mapping attribute values to x-axis positions.
 * @param {number[]} props.values - The array of attribute values to plot.
 * @param {string} props.attribute - The attribute name.
 * @param {boolean} props.isAggregate - Indicates whether the row is an aggregate.
 * @param {Row} props.row - The row object. Rows can be either Subsets or Aggregates.
 * @returns {JSX.Element} The rendered strip plot.
 */
export const StripPlot: FC<Props> = ({
  scale, values, attribute, isAggregate, row,
}) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const attributes = useRecoilValue(visibleAttributesSelector);

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
        // vertical line for x position, go top to bottom
        <line
          // There is no unique identifier for the attribute values other than index, so it is used as key
          // eslint-disable-next-line react/no-array-index-key
          key={`${row.id} + ${idx}`}
          x1={scale(value)}
          x2={scale(value)}
          y1={-(dimensions.attribute.plotHeight / 2)}
          y2={dimensions.attribute.plotHeight / 2}
          stroke="#474242"
          opacity={0.3}
          strokeWidth={dimensions.attribute.dotSize / 3}
        />
      ))}
    </g>
  );
};
