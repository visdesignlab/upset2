import {
  isRowAggregate,
  Row,
  RenderRow,
  isPopulatedSetQuery,
} from '@visdesignlab/upset2-core';
import { FC, useMemo } from 'react';
import { a, useTransition } from 'react-spring';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { AggregateRow } from './AggregateRow';
import { SubsetRow } from './SubsetRow';
import { collapsedSelector } from '../../atoms/collapsedAtom';
import {
  queryBySetsInterfaceAtom,
  setQuerySelector,
} from '../../atoms/config/queryBySetsAtoms';
import { TALL_ROW_TYPES } from '../../dimensions';

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

/**
 * Determines whether a row should be rendered based on its parent ID and the list of collapsed IDs.
 *
 * @param {Row} row - The row object to check.
 * @returns {boolean} - Returns `true` if the row should be rendered, otherwise `false`.
 *
 * The function checks the following conditions:
 * 1. If the row has no parent ID, it should be rendered.
 * 2. If the parent ID contains a hyphen, it extracts the top-level aggregate ID and checks if it is in the list of collapsed IDs.
 * 3. If the parent ID is in the list of collapsed IDs, the row should not be rendered.
 */
const shouldRender = (row: Row, collapsedIds: string[]) => {
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

/**
 * Component that renders matrix rows with transitions.
 *
 * @component
 * @param {Props} props - The properties object.
 * @param {Row[]} props.rows - The array of rows to render.
 *
 * @returns {JSX.Element} The rendered matrix rows component.
 *
 * @function calculateYTransform
 * Calculates the y-transform for a given row.
 * If `queryBySetsInterface` is true, all rows are shifted down by the height of the interface.
 *
 * @function rowTransitions
 * Generates transitions for the rows using react-spring's `useTransition`.
 *
 * @param {Row} row - The row object.
 * @param {number} index - The index of the row.
 * @returns {number} The calculated y-transform value.
 *
 * @param {Array} rows - The array of rows with their respective ids and indices.
 * @param {Object} config - The configuration object for the transitions.
 * @returns {Array} The array of transition objects.
 */
export const MatrixRows: FC<Props> = ({ rows }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const collapsedIds = useRecoilValue(collapsedSelector);
  const setQuery = useRecoilValue(setQuerySelector);
  const queryBySetsInterface = useRecoilValue(queryBySetsInterfaceAtom);

  /**
   * Shifts all rows down by the height of the queryBySets interface
   * or the query row if either is active.
   */
  const transformShift = useMemo(() => {
    if (queryBySetsInterface) {
      return dimensions.setQuery.height + dimensions.setQuery.spacer;
    }
    if (isPopulatedSetQuery(setQuery)) {
      return dimensions.body.rowHeight * 2;
    }
    return 0;
  }, [queryBySetsInterface, dimensions, setQuery]);

  let yTransform = 0;

  const rowTransitions = useTransition(
    rows.map(({ row, id }, index) => {
      // account for double height "set" aggregate rows by doubling height AFTER the aggregate row is rendered
      if (index > 0 && shouldRender(row, collapsedIds)) {
        const prevRow = rows[index - 1].row;
        // Only use aggRowHeight if the previous row is an aggregate containing set membership circles
        // which is NOT contained in a collapsed parent aggregate
        if (
          isRowAggregate(prevRow) &&
          !(prevRow.parent && collapsedIds.includes(prevRow.parent)) &&
          TALL_ROW_TYPES.includes(prevRow.aggregateBy)
        ) {
          yTransform += dimensions.body.aggRowHeight;
        } else yTransform += dimensions.body.rowHeight;
      }

      return {
        id,
        row,
        y: yTransform + transformShift,
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
      {isPopulatedSetQuery(setQuery) && <g id="setQuery" />}
      {rowTransitions(
        ({ transform }, item) =>
          shouldRender(item.row, collapsedIds) && (
            <a.g key={item.id} transform={transform}>
              {rowRenderer(item.row)}
            </a.g>
          ),
      )}
    </g>
  );
};
