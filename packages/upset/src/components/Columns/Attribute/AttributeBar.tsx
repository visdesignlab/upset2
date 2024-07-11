import {
  Aggregate, SixNumberSummary, Items, Subset, isRowAggregate,
} from '@visdesignlab/upset2-core';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { attributeMinMaxSelector } from '../../../atoms/attributeAtom';
import { dimensionsSelector } from '../../../atoms/dimensionsAtom';
import { useScale } from '../../../hooks/useScale';
import translate from '../../../utils/transform';
import { BoxPlot } from './AttributePlots/BoxPlot';
import { DotPlot } from './AttributePlots/DotPlot';
import { StripPlot } from './AttributePlots/StripPlot';
import { itemsAtom } from '../../../atoms/itemsAtoms';
import { DeviationBar } from '../DeviationBar';
import { attributePlotsSelector } from '../../../atoms/config/plotAtoms';

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

const getValuesFromRow = (row: Subset | Aggregate, attribute: string, items: Items): number[] => {
  if (isRowAggregate(row)) {
    return Object.values(row.items.values).map((item) => getValuesFromRow(item, attribute, items)).flat();
  }

  return Object.entries(items).filter(([key, _]) => row.items.includes(key)).map(([_, value]) => value[attribute] as number);
};

// this is recomputing every hover event?
export const AttributeBar: FC<Props> = ({ attribute, summary, row }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const { min, max } = useRecoilValue(attributeMinMaxSelector(attribute));
  const scale = useScale([min, max], [0, dimensions.attribute.width]);
  const items = useRecoilValue(itemsAtom);
  const values = getValuesFromRow(row, attribute, items);

  const attributePlots = useRecoilValue(attributePlotsSelector);

  if (typeof summary !== 'number' && (summary.max === undefined || summary.min === undefined || summary.first === undefined || summary.third === undefined || summary.median === undefined)) {
    return null;
  }

  /*
   * Get the attribute plot to render based on the selected attribute plot type
   * @returns {JSX.Element} The JSX element of the attribute
   */
  function getAttributePlotToRender(): React.JSX.Element {
    // for every entry in attributePlotType, if the attribute matches the current attribute, return the corresponding plot
    if (Object.keys(attributePlots).includes(attribute)) {
      const plot = attributePlots[attribute];

      // render a dotplot for all rows <= 5
      if (row.size <= DOT_PLOT_THRESHOLD) {
        return <DotPlot scale={scale} values={values} attribute={attribute} isAggregate={isRowAggregate(row)} row={row} />;
      }

      switch (plot) {
        case 'Box Plot':
          return <BoxPlot scale={scale} summary={summary as SixNumberSummary} />;
        case 'Strip Plot':
          return <StripPlot scale={scale} values={values} attribute={attribute} isAggregate={isRowAggregate(row)} row={row} />;
        default:
          return <DotPlot scale={scale} values={values} attribute={attribute} isAggregate={isRowAggregate(row)} row={row} jitter />;
      }
    }
    return <BoxPlot scale={scale} summary={summary as SixNumberSummary} />;
  }

  return (
    <g transform={translate(0, dimensions.attribute.plotHeight / 2)}>
      {
        typeof summary === 'number' ?
          <DeviationBar deviation={summary} /> :
          getAttributePlotToRender()
      }
    </g>
  );
};
