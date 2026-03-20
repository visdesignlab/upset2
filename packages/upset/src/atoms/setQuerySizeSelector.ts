import {
  getBelongingSetsFromSetMembership,
  isPopulatedSetQuery,
  isRowAggregate,
  Row,
  SetQueryMembership,
} from '@visdesignlab/upset2-core';
import { selector } from 'recoil';
import { setQuerySelector } from './config/queryBySetsAtoms';
import { flattenedRowsSelector } from './renderRowsAtom';

const rowMatchesSetQuery = (row: Row, membership: SetQueryMembership) => {
  const belongingSets = getBelongingSetsFromSetMembership(row.setMembership);

  return Object.entries(membership).every(([set, status]) => {
    if (status === 'Yes') {
      return belongingSets.includes(set);
    }
    if (status === 'No') {
      return !belongingSets.includes(set);
    }
    return true;
  });
};

/**
 * Selector to calculate the total size of all rows present within a set query.
 *
 * @returns {number} The total size of all rows in the set query.
 */
export const setQuerySizeSelector = selector<number>({
  key: 'setQuerySizeSelector',
  get: ({ get }) => {
    const setQuery = get(setQuerySelector);
    if (setQuery === null || !isPopulatedSetQuery(setQuery)) return 0;
    const { query } = setQuery;

    const rows = get(flattenedRowsSelector);
    return rows.reduce((total, { row }) => {
      if (isRowAggregate(row) || !rowMatchesSetQuery(row, query)) {
        return total;
      }

      return total + row.size;
    }, 0);
  },
});
