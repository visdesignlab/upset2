import { isRowAggregate, Row } from '@visdesignlab/upset2-core';
import React, { FC } from 'react';
import { a, useTransition } from 'react-spring';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { RenderRow } from '../atoms/renderRowsAtom';
import translate from '../utils/transform';
import { AggregateRow } from './AggregateRow';
import { SubsetRow } from './SubsetRow';
import { collapsedSelector } from '../atoms/collapsedAtom';

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
  const collapsedIds = useRecoilValue(collapsedSelector);
  let numRowsToRender = 0;
  
  const shouldRender = (row: Row) => {
    const parentId = row.parent;
    
    if (parentId === undefined) return true;

    if (parentId.includes('-')) {
      const topLevelAggId = parentId.substring(0,parentId.indexOf('-'));
      if (collapsedIds.includes(topLevelAggId)) {
        return false;
      }
    }

    if (collapsedIds.includes(parentId)) return false;

    return true;
  }

  const rowTransitions = useTransition(
    rows.map(({ row, id }) => {
      return {
        id,
        row,
        y: (shouldRender(row) ? numRowsToRender++ : numRowsToRender) * dimensions.body.rowHeight,
      }
    }),
    {
      keys: (d) => d.id,
      enter: ({ y }) => ({ transform: translate(0, y) }),
      update: ({ y }) => ({ transform: translate(0, y) }),
    },
  );

  return (
    <>
      {rowTransitions((props, item) =>
        (
          shouldRender(item.row) &&
          <a.g transform={props.transform}>{rowRenderer(item.row)}</a.g>
        )
      )}
    </>
  );
};
