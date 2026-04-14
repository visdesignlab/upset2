import {
  Aggregate,
  SixNumberSummary,
  Subset,
  isRowAggregate,
} from '@visdesignlab/upset2-core';
import React, { FC, useCallback, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { Tooltip } from '@mui/material';
import { attributeMinMaxSelector } from '../../../atoms/attributeAtom';
import { dimensionsSelector } from '../../../atoms/dimensionsAtom';
import { useScale } from '../../../hooks/useScale';
import translate from '../../../utils/transform';
import { BoxPlot } from './AttributePlots/BoxPlot';
import { DotPlot } from './AttributePlots/DotPlot';
import { StripPlot } from './AttributePlots/StripPlot';
import { DensityPlot } from './AttributePlots/DensityPlot';
import { DeviationBar } from '../DeviationBar';
import { attributePlotsSelector } from '../../../atoms/config/plotAtoms';
import { attValuesSelector } from '../../../atoms/elementsSelectors';
import { attTypesSelector } from '../../../atoms/attributeAtom';
import { formatDateValue } from '../../../utils/date';

/**
 * Attribute bar props
 */
type Props = {
  /**
   * The attribute to render
   */
  attribute: string;
  /**
   * The summary statistics for the attribute
   * Can be SixNumberSummary if it is an attribute, or a number if it is Deviation
   */
  summary: SixNumberSummary | number;
  /**
   * Row Type
   */
  row: Subset | Aggregate;
};

// Threshold for when to render a dot plot regardless of selected plot type
const DOT_PLOT_THRESHOLD = 5;

/**
 * A single attribute chart, visualizing one attribute's values for one intersection.
 */
export const AttributeBar: FC<Props> = ({ attribute, summary, row }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const { min, max } = useRecoilValue(attributeMinMaxSelector(attribute));
  const attTypes = useRecoilValue(attTypesSelector);
  const scale = useScale([min, max], [0, dimensions.attribute.width]);
  const values = useRecoilValue(attValuesSelector({ row, att: attribute }));
  const attributePlots = useRecoilValue(attributePlotsSelector);
  const isDateAttribute = attTypes[attribute] === 'date';
  const dateDomain: [number, number] = [min, max];

  /*
   * Get the attribute plot to render based on the selected attribute plot type
   * @returns {JSX.Element} The JSX element of the attribute
   */
  const attPlotToRender: React.JSX.Element = useMemo(() => {
    // for every entry in attributePlotType, if the attribute matches the current attribute, return the corresponding plot
    if (Object.keys(attributePlots).includes(attribute) && typeof summary !== 'number') {
      const plot = attributePlots[attribute];

      // render a dotplot for all rows <= 5, except for Strip Plots which encode the same information
      if (row.size <= DOT_PLOT_THRESHOLD && plot !== 'Strip Plot') {
        return (
          <DotPlot
            scale={scale}
            values={values}
            isAggregate={isRowAggregate(row)}
            row={row}
          />
        );
      }

      switch (plot) {
        case 'Box Plot':
          return <BoxPlot scale={scale} summary={summary} />;
        case 'Strip Plot':
          return (
            <StripPlot
              scale={scale}
              values={values}
              isAggregate={isRowAggregate(row)}
              row={row}
            />
          );
        case 'Density Plot':
          return <DensityPlot values={values} attribute={attribute} row={row} />;
        default:
          return (
            <DotPlot
              scale={scale}
              values={values}
              isAggregate={isRowAggregate(row)}
              row={row}
              jitter
            />
          );
      }
    }
    return <DensityPlot values={values} attribute={attribute} row={row} />;
  }, [attribute, attributePlots, row, scale, summary, values]);

  /**
   * Round a number to 3 decimal places
   */
  const round3 = useCallback((num: number | undefined): number => {
    if (num === undefined) {
      return NaN;
    }
    return Math.round(num * 1000) / 1000;
  }, []);

  const formatSummaryValue = useCallback(
    (num: number | undefined): string | number => {
      if (isDateAttribute) return formatDateValue(num, dateDomain);
      return round3(num);
    },
    [dateDomain, isDateAttribute, round3],
  );

  if (
    typeof summary !== 'number' &&
    (summary.max === undefined ||
      summary.min === undefined ||
      summary.first === undefined ||
      summary.third === undefined ||
      summary.median === undefined)
  ) {
    return null;
  }

  return (
    <g transform={translate(0, dimensions.attribute.plotHeight / 2)}>
      {typeof summary === 'number' ? (
        <DeviationBar deviation={summary} />
      ) : (
        <Tooltip
          title={
            <div style={{ whiteSpace: 'pre-line' }}>
              {`Q1: ${formatSummaryValue(summary.first)}\nMean: ${formatSummaryValue(summary.mean)}\nMedian: ${formatSummaryValue(summary.median)}\nQ3: ${formatSummaryValue(summary.third)}`}
            </div>
          }
        >
          {/* Wrapping <g> is necessary for the Tooltip to work (it needs a specific contained component that can take a ref) */}
          <g>{attPlotToRender}</g>
        </Tooltip>
      )}
    </g>
  );
};
