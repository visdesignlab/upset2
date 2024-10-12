import { VegaLite } from 'react-vega';
import { Subset, Aggregate, AttributePlotType } from '@visdesignlab/upset2-core';
import {
  FC, useCallback, useMemo, useRef,
} from 'react';
import { useRecoilValue } from 'recoil';
import { Renderers } from 'vega';
import { generateAttributePlotSpec } from './generateAttributePlotSpec';
import { dimensionsSelector } from '../../../../atoms/dimensionsAtom';
import { attributeMinMaxSelector } from '../../../../atoms/attributeAtom';
import {
  bookmarkedColorPalette, bookmarkSelector, currentIntersectionSelector, nextColorSelector,
} from '../../../../atoms/config/currentIntersectionAtom';
import { ATTRIBUTE_DEFAULT_COLOR } from '../../../../utils/styles';

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
export const DensityPlot: FC<Props> = ({
  values, attribute, row,
}) => {
  const dimensions = useRecoilValue(dimensionsSelector);

  const { min, max } = useRecoilValue(attributeMinMaxSelector(attribute));
  const currentIntersection = useRecoilValue(currentIntersectionSelector);
  const bookmarks = useRecoilValue(bookmarkSelector);
  const colorPalette = useRecoilValue(bookmarkedColorPalette);
  const nextColor = useRecoilValue(nextColorSelector);

  // We need to use a ref here to avoid re-rendering the plot on every render.
  const RENDERER = useRef<Renderers>('svg');

  /**
   * Logic for determining the selection/bookmark status of the row.
   * @returns {string} The fill color for the density plot.
   */
  const getFillColor = useCallback(
    () => {
    // if the row is bookmarked, highlight the bar with the bookmark color
      if (row !== undefined && bookmarks.some((b) => b.id === row.id)) {
      // darken the color for advanced scale sub-bars
        return colorPalette[row.id];
      }

      // We don't want to evaluate this to true if both currentIntersection and row are undefined, hence the 1st condition
      if (currentIntersection && currentIntersection?.id === row?.id) { // if currently selected, use the highlight colors
        return nextColor;
      }
      return ATTRIBUTE_DEFAULT_COLOR;
    },
    [row, currentIntersection, bookmarks, colorPalette, nextColor],
  );

  const spec = useMemo(
    () => generateAttributePlotSpec(AttributePlotType.DensityPlot, values, min, max, getFillColor()),
    [values, min, max, getFillColor],
  );

  return (
    <g
      id="Density"
      transform={`translate(0, ${-dimensions.attribute.plotHeight / 1.5})`}
    >
      <foreignObject width={dimensions.attribute.width} height={dimensions.attribute.plotHeight + 20}>
        <VegaLite
          renderer={RENDERER.current}
          height={dimensions.attribute.plotHeight + 6}
          actions={false}
          spec={spec as any}
        />
      </foreignObject>
    </g>
  );
};
