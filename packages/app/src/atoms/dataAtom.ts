import { process } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { api } from './authAtoms';
import { logInStatusSelector } from './loginAtom';
import { queryParamAtom } from './queryParamAtom';

export const dataAtom = selector({
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
