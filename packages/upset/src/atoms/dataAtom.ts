import { ColumnName, CoreUpsetData } from '@visdesignlab/upset2-core';
import { atom, selector } from 'recoil';

/**
 * Atom to store the data for the Upset plot
 */
export const dataAtom = atom<CoreUpsetData | Record<string, never>>({
  key: 'data',
  default: {},
});

/**
 * Returns all columns that can be used in a string query, ie are not numeric, not set columns,
 * and not private columns that start with _
 */
export const queryColumnsSelector = selector<ColumnName[]>({
  key: 'data-columns',
  get: ({ get }) => {
    const data = get(dataAtom);
    return data.columns.filter((col) => data.columnTypes[col] !== 'number'
      && !data.setColumns.includes(col)
      && !col.startsWith('_'));
  },
});
