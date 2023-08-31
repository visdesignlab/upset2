import { Aggregate, FiveNumberSummary, Items, Subset, isRowAggregate } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { attributeMinMaxSelector } from '../atoms/attributeAtom';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { useScale } from '../hooks/useScale';
import translate from '../utils/transform';
import { BoxPlot } from './custom/BoxPlot';
import { DotPlot } from './custom/DotPlot';
import { itemsAtom } from '../atoms/itemsAtoms';

type Props = {
  attribute: string;
  summary: FiveNumberSummary;
  row: Subset | Aggregate;
};

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

  if (summary.max === undefined || summary.min === undefined || summary.first === undefined || summary.third === undefined || summary.median === undefined) {
    return null;
  }

  return (
    <g transform={translate(0, dimensions.attribute.plotHeight / 2)}>
      { row.size > 5
        ? <BoxPlot scale={scale} summary={summary} />
        : <DotPlot scale={scale} values={values} attribute={attribute} summary={summary} isAggregate={isRowAggregate(row)} />}
    </g>
  );
};
