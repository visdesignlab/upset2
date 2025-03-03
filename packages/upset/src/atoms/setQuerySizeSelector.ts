import { selector } from 'recoil';
import { flattenedRowsSelector } from './renderRowsAtom';

export const setQuerySizeSelector = selector<number>({
  key: 'setQuerySizeSelector',
  get: ({ get }) => {
    const rows = get(flattenedRowsSelector);
    let total = 0;
    rows.forEach((rr) => {
      total += rr.row.size;
    });
    return total;
  },
});
