import {
  flattenedOnlyRows, flattenedRows, Row,
  RowMap,
} from '@visdesignlab/upset2-core';
import { selector } from 'recoil';
import { upsetConfigAtom } from './config/upsetConfigAtoms';
import { dataAtom } from './dataAtom';

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
 * Counts the number of rows in the plot
 */
export const rowCountSelector = selector({
  key: 'row-count',
  get: ({ get }) => Object.values(get(rowsSelector)).length,
});
