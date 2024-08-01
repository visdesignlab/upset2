import { isRowAggregate, Row, RenderRow } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { a, useTransition } from 'react-spring';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { AggregateRow } from './AggregateRow';
import { SubsetRow } from './SubsetRow';
import { collapsedSelector } from '../../atoms/collapsedAtom';
import { queryBySetsInterfaceAtom } from '../../atoms/queryBySetsAtoms';

type Props = {
  rows: RenderRow[];
};

/**
 * Renders a row based on its type.
 * @param row - The row to be rendered.
 * @returns The rendered row component.
 */
export function rowRenderer(row: Row) {
  if (isRowAggregate(row)) {
    return <AggregateRow aggregateRow={row} />;
  }
  return <SubsetRow subset={row} />;
}

export const MatrixRows: FC<Props> = ({ rows }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const collapsedIds = useRecoilValue(collapsedSelector);
  const queryBySetsInterface = useRecoilValue(queryBySetsInterfaceAtom);

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

  /**
  * Calculates the y-transform for a given row
  * If queryBySetsInterface is true, all rows are shifted down by the height of the interface
  */
  const calculateYTransform = (row: Row, index: number) => {
    if (shouldRender(row) && index > 0) {
      yTransform += dimensions.body.rowHeight;
    }

    return yTransform + (queryBySetsInterface ? dimensions.setQuery.height + dimensions.setQuery.spacer : 0);
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
        y: calculateYTransform(row, index),
      };
    }),
    {
      keys: (d) => d.id,
      enter: ({ y }) => ({ transform: translate(0, y) }),
      update: ({ y }) => ({ transform: translate(0, y) }),
    },
  );

  return (
    <g id="matrixRows" onClick={(e) => e.stopPropagation()}>
      {rowTransitions(({ transform }, item) => (
        shouldRender(item.row) &&
          <a.g key={item.id} transform={transform}>{rowRenderer(item.row)}</a.g>
      ))}
    </g>
  );
};
