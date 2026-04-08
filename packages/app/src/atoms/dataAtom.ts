import { CoreUpsetData, process } from '@visdesignlab/upset2-core';
import { atom, selector } from 'recoil';

import { queryParamAtom } from './queryParamAtom';
import { getColumnTypes, getTable } from '../api/data';

export const dataSelector = selector<CoreUpsetData | null>({
  key: 'upset-data',
  get: async ({ get }) => {
    const { workspace, table } = get(queryParamAtom);

    if (!workspace || !table) return null;

    let rows;
    try {
      rows = await getTable(workspace, table);
    } catch {
      return null;
    }

    const annotations = await getColumnTypes(workspace, table);

    return process(rows, annotations);
  },
});

export const encodedDataAtom = atom<CoreUpsetData | null>({
  key: 'encoded-upset-data',
  default: null,
});

/**
 * Selector that checks whether the loaded dataset contains any NaN values.
 * NaN values in set (boolean) or numeric columns can cause rendering failures.
 * Returns true if NaN values are present in any item attribute.
 */
export const nanErrorSelector = selector<boolean>({
  key: 'nan-error',
  get: ({ get }) => {
    const data = get(dataSelector);
    if (!data) return false;

    return Object.values(data.items).some((item) =>
      Object.values(item.atts).some(
        (val) => typeof val === 'number' && Number.isNaN(val),
      ),
    );
  },
});
