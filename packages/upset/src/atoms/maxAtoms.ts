import { flattenedRows } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { dataAtom } from './dataAtom';
import { upsetConfigAtom } from './config/upsetConfigAtoms';

export const maxDeviationSelector = selector({
  key: 'max-deviation',
  get: ({ get }) => {
    const data = get(dataAtom);
    const state = get(upsetConfigAtom);
    const rows = flattenedRows(data, state)

    const deviations = rows.map((d) => Math.abs(d.row.deviation));
    const maxDeviation = Math.max(...deviations);

    return maxDeviation;
  },
});
