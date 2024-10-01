import {
  flattenedOnlyRows, flattenedRows, Row, rowsCount,
} from '@visdesignlab/upset2-core';
import { selector } from 'recoil';
import { upsetConfigAtom } from './config/upsetConfigAtoms';
import { dataAtom } from './dataAtom';

export type RowConfig = {
  position: number;
  collapsed: boolean;
};

export type RowConfigMap = { [key: string]: RowConfig };

export const rowCountSelector = selector({
  key: 'row-count',
  get: ({ get }) => {
    const data = get(dataAtom);
    const state = get(upsetConfigAtom);

    return rowsCount(data, state);
  },
});

export const flattenedRowsSelector = selector({
  key: 'flattened-rows',
  get: ({ get }) => {
    const data = get(dataAtom);
    const state = get(upsetConfigAtom);

    return flattenedRows(data, state);
  },
});

/**
 * Gets all rows in the plot
 */
export const rowsSelector = selector<Record<string, Row>>({
  key: 'plot-rows',
  get: ({ get }) => {
    const data = get(dataAtom);
    const state = get(upsetConfigAtom);
    return flattenedOnlyRows(data, state);
  },
});
