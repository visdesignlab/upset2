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
    } catch (e) {
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
