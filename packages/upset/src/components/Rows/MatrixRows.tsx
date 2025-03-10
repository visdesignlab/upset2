import { isRowAggregate, Row, RenderRow, isPopulatedSetQuery } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { a, useTransition } from 'react-spring';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { AggregateRow } from './AggregateRow';
import { SubsetRow } from './SubsetRow';
import { collapsedSelector } from '../../atoms/collapsedAtom';
import { queryBySetsInterfaceAtom, setQuerySelector } from '../../atoms/config/queryBySetsAtoms';

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

  let yTransform = 0;

  /**
  * Calculates the y-transform for a given row
  * If queryBySetsInterface is true, all rows are shifted down by the height of the interface
  */
  const calculateYTransform = (row: Row, index: number) => {
    if (shouldRender(row, collapsedIds) && index > 0) {
      yTransform += dimensions.body.rowHeight;
    }

    // Shift the rows down by the height of the set query interface or the set query row if populated
    let transformShift = 0;
    if (queryBySetsInterface) {
      transformShift += dimensions.setQuery.height + dimensions.setQuery.spacer;
    }
    if (isPopulatedSetQuery(setQuery)) {
      transformShift += dimensions.body.rowHeight * 2;
    }

    return yTransform + transformShift;
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
      { isPopulatedSetQuery(setQuery) && <g id="setQuery" />}
      {rowTransitions(({ transform }, item) => (
        shouldRender(item.row, collapsedIds) &&
          <a.g key={item.id} transform={transform}>{rowRenderer(item.row)}</a.g>
      ))}
    </g>
  );
};
