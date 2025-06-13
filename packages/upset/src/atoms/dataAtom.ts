import { ColumnName, CoreUpsetData } from '@visdesignlab/upset2-core';
import { atom, selector } from 'recoil';

/**
 * Atom to store the data for the Upset plot
 */
export const dataAtom = atom<CoreUpsetData>({
  key: 'data',
  default: {
    label: '',
    setColumns: [],
    attributeColumns: [],
    columns: [],
    columnTypes: {},
    items: {},
    sets: {},
  },
});

export const totalItemsSelector = selector<number>({
  key: 'total-items',
  get: ({ get }) => Object.keys(get(dataAtom).items).length,
});

/**
 * Returns all columns that can be used in a string query, ie are not numeric, not set columns,
 * and not private columns that start with _
 */
export const queryColumnsSelector = selector<ColumnName[]>({
  key: 'data-columns',
  get: ({ get }) => {
    const BUILTIN_COLS = ['_id', '_from', '_to', '_key', '_rev'];
    const data = get(dataAtom);
    return data.columns.filter(
      (col) => !data.setColumns.includes(col) && !BUILTIN_COLS.includes(col),
    );
  },
});

/**
 * Returns the boolean columns that indicate set membership
 */
export const setColumnsSelector = selector<ColumnName[]>({
  key: 'set-columns',
  get: ({ get }) => {
    const data = get(dataAtom);
    return data.setColumns;
  },
});
