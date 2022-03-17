import { isRowAggregate, Row } from '@visdesignlab/upset2-core';
import React, { FC } from 'react';
import { a, useTransition } from 'react-spring';
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

  const rowTransitions = useTransition(
    rows.map(({ row, id }, idx) => ({
      id,
      row,
      y: idx * dimensions.body.rowHeight,
    })),
    {
      keys: (d) => d.id,
      enter: ({ y }) => ({ transform: translate(0, y) }),
      update: ({ y }) => ({ transform: translate(0, y) }),
    },
  );

  return (
    <>
      {rowTransitions((props, item) => (
        <a.g transform={props.transform}>{rowRenderer(item.row)}</a.g>
      ))}
    </>
  );
};
