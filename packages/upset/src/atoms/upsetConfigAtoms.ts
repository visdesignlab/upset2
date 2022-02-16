import { AggregateBy, SortBy, UpsetConfig } from '@visdesignlab/upset2-core';
import { atom, DefaultValue, selector } from 'recoil';
import { visibleSetsAtom } from './setsAtoms';

export const firstAggregateByAtom = atom<AggregateBy>({
  key: 'fab',
  default: 'Deviations',
});

const firstOverlapDegreeBaseAtom = atom({
  key: 'fab_degree',
  default: 2,
});

export const firstOverlapDegreeAtom = selector<number>({
  key: 'fab_degree_selector',
  get: ({ get }) => get(firstOverlapDegreeBaseAtom),
  set: ({ get, set }, val) => {
    const visibleSets = get(visibleSetsAtom);
    let toSet = val;
    if (val < 0) toSet = 0;
    if (val > visibleSets.length) toSet = visibleSets.length;

    set(firstOverlapDegreeBaseAtom, toSet);
  },
});

export const secondAggregateByAtom = atom<AggregateBy>({
  key: 'sab',
  default: 'Sets',
});

const secondOverlapDegreeBaseAtom = atom({
  key: 'sab_degree',
  default: 2,
});

export const secondOverlapDegreeAtom = selector<number>({
  key: 'sab_degree_selector',
  get: ({ get }) => get(secondOverlapDegreeBaseAtom),
  set: ({ get, set }, val) => {
    const visibleSets = get(visibleSetsAtom);
    let toSet = val;
    if (val < 0) toSet = 0;
    if (val > visibleSets.length) toSet = visibleSets.length;

    set(secondOverlapDegreeBaseAtom, toSet);
  },
});

export const sortByAtom = atom<SortBy>({
  key: 'sortBy',
  default: 'Cardinality',
});

export const maxVisibleAtom = atom({
  key: 'maxVisible',
  default: 3,
});

export const minVisibleAtom = atom({
  key: 'minVisible',
  default: 0,
});

export const hideEmptyAtom = atom({
  key: 'hideEmpty',
  default: true,
});

export const upsetConfigSelector = selector<UpsetConfig>({
  key: 'upsetConfig',
  get: ({ get }) => {
    const firstAggregateBy = get(firstAggregateByAtom);
    const firstOverlapDegree = get(firstOverlapDegreeAtom);
    const secondAggregateBy = get(secondAggregateByAtom);
    const secondOverlapDegree = get(secondOverlapDegreeAtom);
    const sortBy = get(sortByAtom);
    const maxVisible = get(maxVisibleAtom);
    const minVisible = get(minVisibleAtom);
    const hideEmpty = get(hideEmptyAtom);

    return {
      firstAggregateBy,
      firstOverlapDegree,
      secondOverlapDegree,
      secondAggregateBy,
      sortBy,
      filters: {
        maxVisible,
        minVisible,
        hideEmpty,
      },
    };
  },
  set: ({ get, set, reset }, val) => {
    const firstAggregateBy = get(firstAggregateByAtom);
    const firstOverlapDegree = get(firstOverlapDegreeAtom);
    const secondAggregateBy = get(secondAggregateByAtom);
    const secondOverlapDegree = get(secondOverlapDegreeAtom);
    const sortBy = get(sortByAtom);
    const maxVisible = get(maxVisibleAtom);
    const minVisible = get(minVisibleAtom);
    const hideEmpty = get(hideEmptyAtom);

    if (val instanceof DefaultValue) {
      reset(firstAggregateByAtom);
      reset(firstOverlapDegreeAtom);
      reset(secondAggregateByAtom);
      reset(secondOverlapDegreeAtom);
      reset(sortByAtom);
      reset(maxVisibleAtom);
      reset(minVisibleAtom);
      reset(hideEmptyAtom);
    } else {
      if (firstAggregateBy !== val.firstAggregateBy) {
        set(firstAggregateByAtom, val.firstAggregateBy);
      }

      if (firstOverlapDegree !== val.firstOverlapDegree) {
        set(firstOverlapDegreeAtom, val.firstOverlapDegree);
      }

      if (secondAggregateBy !== val.secondAggregateBy) {
        set(secondAggregateByAtom, val.secondAggregateBy);
      }

      if (secondOverlapDegree !== val.secondOverlapDegree) {
        set(secondOverlapDegreeAtom, val.secondOverlapDegree);
      }

      if (sortBy !== val.sortBy) {
        set(sortByAtom, val.sortBy);
      }

      if (maxVisible !== val.filters.maxVisible) {
        set(maxVisibleAtom, val.filters.maxVisible);
      }

      if (minVisible !== val.filters.minVisible) {
        set(minVisibleAtom, val.filters.minVisible);
      }

      if (hideEmpty !== val.filters.hideEmpty) {
        set(hideEmptyAtom, val.filters.hideEmpty);
      }
    }
  },
});
