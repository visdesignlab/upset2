import {
  flattenedOnlyRows, flattenedRows,
  isRowAggregate,
  RowMap,
} from '@visdesignlab/upset2-core';
import { selector } from 'recoil';
import { upsetConfigAtom } from './config/upsetConfigAtoms';
import { dataAtom } from './dataAtom';
import { TALL_ROW_TYPES } from '../dimensions';

export const flattenedRowsSelector = selector({
  key: 'flattened-rows',
  get: ({ get }) => {
    const data = get(dataAtom);
    const state = get(upsetConfigAtom);

    return flattenedRows(data, state);
  },
});

/**
 * Gets all rows in the plot as a map from ID to Row
 * @returns {Record<string, Row>}
 */
export const rowsSelector = selector<RowMap>({
  key: 'plot-rows',
  get: ({ get }) => {
    const data = get(dataAtom);
    const state = get(upsetConfigAtom);
    return flattenedOnlyRows(data, state);
  },
});

/**
 * Counts the number of UNIQUE rows in the plot.
 * This may differ from the number of displayed rows if there are duplicates displayed, IE aggregate by overlap.
 */
export const rowCountSelector = selector({
  key: 'row-count',
  get: ({ get }) => Object.values(get(rowsSelector)).length,
});

/**
 * Counts the number of rows currently displayed in the plot.
 * This may differ from the number of unique rows if there are duplicates displayed, IE aggregate by overlap.
 */
export const displayedRowCountSelector = selector({
  key: 'displayed-row-count',
  get: ({ get }) => Object.values(get(flattenedRowsSelector)).length,
});

/**
* Counts the number of aggregate rows with types defined in dimensions.ts/TALL_ROW_TYPES.
* @param rows - The rows to count aggregate rows from.
*  (these are aggregate rows with types defined in dimensions.ts/TALL_ROW_TYPES).
*/
export const tallRowCountSelector = selector({
  key: 'tall-row-count',
  get: ({ get }) => {
    let count = 0;
    get(flattenedRowsSelector).forEach((renderRow) => {
      if (isRowAggregate(renderRow.row) && TALL_ROW_TYPES.includes(renderRow.row.aggregateBy)) {
        count++;
      }
    });
    return count;
  },
});
