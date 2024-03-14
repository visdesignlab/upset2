import { isRowAggregate, Row, RenderRow } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { a, useTransition } from 'react-spring';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { AggregateRow } from './AggregateRow';
import { SubsetRow } from './SubsetRow';
import { collapsedSelector } from '../../atoms/collapsedAtom';

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

  const shouldRender = (row: Row) => {
    const parentId = row.parent;

    if (parentId === undefined) return true;

    if (parentId.includes('-')) {
      const topLevelAggId = parentId.substring(0, parentId.indexOf('-'));
      if (collapsedIds.includes(topLevelAggId)) {
        return false;
      }
    }

    if (collapsedIds.includes(parentId)) return false;

    return true;
  };

  let yTransform = 0;

  // calculates the y-transform for a given row
  const calculateYTransform = (row: Row) => {
    if (shouldRender(row)) {
      yTransform += dimensions.body.rowHeight;
    }

    return yTransform;
  };

  const rowTransitions = useTransition(
    rows.map(({ row, id }, index) => {
      // account for double height "set" aggregate rows by doubling height AFTER the aggregate row is rendered
      if (index > 0) {
        const prevRow = rows[index - 1].row;
        /*
         * Only add an extra rowHeight to the transform if the previous row is
         * an aggregate containing set membership circles which is NOT contained in a collapsed parent aggregate
         */
        if (isRowAggregate(prevRow)
          && !(prevRow.parent && collapsedIds.includes(prevRow.parent))
          && ['Sets', 'Overlaps'].includes(prevRow.aggregateBy)) {
          yTransform += dimensions.body.rowHeight;
        }
      }

      return {
        id,
        row,
        y: (index > 0) ? calculateYTransform(row) : 0,
      };
    }),
    {
      keys: (d) => d.id,
      enter: ({ y }) => ({ transform: translate(0, y) }),
      update: ({ y }) => ({ transform: translate(0, y) }),
    },
  );

  return (
    <g onClick={(e) => e.stopPropagation()}>
      {rowTransitions(({ transform }, item) => (
        shouldRender(item.row) &&
          <a.g key={item.id} transform={transform}>{rowRenderer(item.row)}</a.g>
      ))}
    </g>
  );
};
