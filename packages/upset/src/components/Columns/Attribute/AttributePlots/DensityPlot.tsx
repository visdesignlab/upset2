import { Subset, Aggregate } from '@visdesignlab/upset2-core';
import { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../../../../atoms/dimensionsAtom';
import { attributeMinMaxSelector } from '../../../../atoms/attributeAtom';
import {
  isRowBookmarkedOrSelected,
  bookmarkColorSelector,
} from '../../../../atoms/config/selectionAtoms';
import { ATTRIBUTE_DEFAULT_COLOR } from '../../../../utils/styles';
import { MemoizedDensityVega } from './MemoizedDensityVega';

/**
 * Props for the DotPlot component.
 */
type Props = {
  /**
   * Array of attribute values to plot.
   */
  values: number[];
  /**
   * The attribute name.
   */
  attribute: string;
  /**
   * The row object. Rows can be either Subsets or Aggregates.
   */
  row: Subset | Aggregate;
};

/**
 * DensityPlot component displays a density plot for a given attribute.
 * @param values - The values for the density plot.
 * @param attribute - The attribute for which the density plot is displayed.
 * @param row - The row for which the density plot is displayed.
 */
export const DensityPlot: FC<Props> = ({ values, attribute, row }) => {
  const dimensions = useRecoilValue(dimensionsSelector);

  const { min, max } = useRecoilValue(attributeMinMaxSelector(attribute));
  const bookmarkedOrSelected = useRecoilValue(isRowBookmarkedOrSelected(row));
  const color = useRecoilValue(bookmarkColorSelector(row.id));

  /**
   * Logic for determining the selection/bookmark status of the row.
   * @returns {string} The fill color for the density plot.
   */
  const fillColor = useMemo(() => {
    if (bookmarkedOrSelected) return color;
    return ATTRIBUTE_DEFAULT_COLOR;
  }, [bookmarkedOrSelected, color]);

  return (
    <g id="Density" transform={`translate(0, ${-dimensions.attribute.plotHeight / 1.5})`}>
      <foreignObject
        width={dimensions.attribute.width}
        height={dimensions.attribute.plotHeight}
      >
        <MemoizedDensityVega
          values={values}
          fillColor={fillColor}
          min={min}
          max={max}
          height={dimensions.attribute.plotHeight}
        />
      </foreignObject>
    </g>
  );
};
