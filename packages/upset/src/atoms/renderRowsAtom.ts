import {
  Rows,
  areRowsAggregates,
  firstAggregation,
  secondAggregation,
  sortRows,
  filterRows,
  areRowsSubsets,
} from '@visdesignlab/upset2-core';
import { selector } from 'recoil';
import { subsetSelector } from './subsetAtoms';
import {
  firstAggregateByAtom,
  hideEmptyAtom,
  maxVisibleAtom,
  minVisibleAtom,
  secondAggregateByAtom,
  sortByAtom,
} from './upsetConfigAtoms';

const firstAggRRSelector = selector<Rows>({
  key: 'farr',
  get: ({ get }) => {
    const aggBy = get(firstAggregateByAtom);
    const subsets = get(subsetSelector);

    return firstAggregation(subsets, aggBy);
  },
});

const secondAggRRSelector = selector<Rows>({
  key: 'sarr',
  get: ({ get }) => {
    const aggBy = get(secondAggregateByAtom);
    const rr = get(firstAggRRSelector);

    if (areRowsAggregates(rr)) {
      return secondAggregation(rr, aggBy);
    }

    return rr;
  },
});

const sortByRRSelector = selector<Rows>({
  key: 'sortRR',
  get: ({ get }) => {
    const sortBy = get(sortByAtom);
    const rr = get(secondAggRRSelector);

    return sortRows(rr, sortBy);
  },
});

const filterRRSelector = selector<Rows>({
  key: 'filterRR',
  get: ({ get }) => {
    const maxVisible = get(maxVisibleAtom);
    const minVisible = get(minVisibleAtom);
    const hideEmpty = get(hideEmptyAtom);
    const rr = get(sortByRRSelector);

    return filterRows(rr, { maxVisible, minVisible, hideEmpty });
  },
});

export const renderRowSelector = selector<Rows>({
  key: 'renderRows',
  get: ({ get }) => get(filterRRSelector),
});

export const renderRowsCountSelector = selector({
  key: 'rrCount',
  get: ({ get }) => {
    const rr = get(renderRowSelector);
    if (areRowsSubsets(rr)) {
      return rr.order.length;
    }

    return 1;
  },
});
