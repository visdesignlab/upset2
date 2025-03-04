import { selector } from 'recoil';
import { flattenedRowsSelector } from './renderRowsAtom';

/**
 * Selector to calculate the total size of all rows present within a set query.
 *
 * @returns {number} The total size of all rows in the set query.
 */
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
