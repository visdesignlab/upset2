import { isRowAggregate, Row } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { RenderRow } from '../atoms/renderRowsAtom';
import translate from '../utils/transform';
import { AggregateRow } from './AggregateRow';
import { SubsetRow } from './SubsetRow';

type Props = {
  rows: RenderRow[];
};

export function rowRenderer(row: Row) {
  if (isRowAggregate(row)) {
    return <AggregateRow aggregateRow={row} />;
  }
  return <SubsetRow subset={row} />;
}

export const MatrixRows: FC<Props> = ({ rows }) => {
  const dimensions = useRecoilValue(dimensionsSelector);

  return (
    <>
      {rows.map(({ row, id }, idx) => (
        <g key={id} transform={translate(0, idx * dimensions.body.rowHeight)}>
          {rowRenderer(row)}
        </g>
      ))}
    </>
  );
};
