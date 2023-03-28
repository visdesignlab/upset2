import { CoreUpsetData, process } from '@visdesignlab/upset2-core';
import { atom, selector } from 'recoil';

import { api } from './authAtoms';
import { logInStatusSelector } from './loginAtom';
import { queryParamAtom } from './queryParamAtom';

export const dataSelector = selector<CoreUpsetData | null>({
  key: 'upset-data',
  get: async ({ get }) => {
    const isLoggedIn = get(logInStatusSelector);

    if (!isLoggedIn) return null;

    const { workspace, table } = get(queryParamAtom);

    if (!workspace || !table) return null;

    const rows = (
      await api.table(workspace, table, {
        limit: Number.MAX_SAFE_INTEGER,
      })
    ).results;

    const annotations = await api.columnTypes(workspace, table);
    
    return process(rows as any, { columns: annotations } as any);
  },
});

export const encodedDataAtom = atom<CoreUpsetData | null>({
  key: 'encoded-upset-data',
  default: null
})
