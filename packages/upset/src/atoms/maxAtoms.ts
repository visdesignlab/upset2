import { selector } from 'recoil';

import { flattenedRowsSelector } from './renderRowsAtom';

export const maxDeviationSelector = selector({
  key: 'max-deviation',
  get: ({ get }) => {
    const rows = get(flattenedRowsSelector);

    const deviations = rows.map((d) => Math.abs(d.row.deviation));
    const maxDeviation = Math.max(...deviations);

    return maxDeviation;
  },
});
