import { FC, memo, useMemo } from 'react';
import { AttributePlotType } from '@visdesignlab/upset2-core';
import { VegaLite } from 'react-vega';
import { generateAttributePlotSpec } from './generateAttributePlotSpec';

type Props = {
  /**
   * Array of attribute values to plot.
   */
  values: number[];
  /**
   * Fill color for the plot
   */
  fillColor: string;
  /**
   * Minimum value for the attribute
   */
  min: number;
  /**
   * Maximum value for the attribute
   */
  max: number;
  /**
   * Height of the plot
   */
  height: number;
};

/**
 * The VegaLite density plot component, memoized by direct value comparisons to prevent unnecessary re-renders.
 */
export const MemoizedDensityVega: FC<Props> = memo(
  ({ values, fillColor, min, max, height }: Props) => {
    const spec = useMemo(
      () =>
        generateAttributePlotSpec(
          AttributePlotType.DensityPlot,
          values,
          min,
          max,
          fillColor,
        ) ?? {},
      [values, min, max, fillColor],
    );

    return (
      // This fix does NOT affect the layout in other browsers, and is necessary to prevent the layout from breaking in safari.
      // Part of the reason this is necessary is because we are required to use !important to override the position property set by react-vega;
      // However, react does NOT support !important in inline styles, so we have to use the css prop to apply the style.
      <VegaLite
        renderer="svg"
        spec={spec}
        actions={false}
        height={height}
        // @ts-expect-error react-vega does not have types for css prop
        css={{ position: 'initial !important' }}
      />
    );
  },
  // Instead of checking all values, we assume that equal length & equal first & last elements are sufficient
  // Yes, this is a greedy heuristic. However, values should never change for most subsets.
  // Only the unincluded subset will change values, which happens due to adding or removing sets;
  // an atomic operation which is guaranteed to change the size of the unincluded subset.
  // (technically a Trrack action could add & remove a set at the same time, but the probability of that happening--
  // while keeping the same length, not changing the first/last values, and changing values in the middle--is negligible)
  (prevProps, nextProps) =>
    prevProps.values.length === nextProps.values.length &&
    (prevProps.values.length > 0
      ? prevProps.values[0] === nextProps.values[0] &&
        prevProps.values[prevProps.values.length - 1] ===
          nextProps.values[nextProps.values.length - 1]
      : true) &&
    prevProps.height === nextProps.height &&
    prevProps.fillColor === nextProps.fillColor &&
    prevProps.min === nextProps.min &&
    prevProps.max === nextProps.max,
);
