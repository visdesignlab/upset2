import { AggregateBy, SortBy, UpsetConfig } from '@visdesignlab/upset2-core';
import { atom, DefaultValue, selector } from 'recoil';

export const firstAggregateByAtom = atom<AggregateBy>({
  key: 'fab',
  default: 'None',
});

export const secondAggregateByAtom = atom<AggregateBy>({
  key: 'sab',
  default: 'None',
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
    const secondAggregateBy = get(secondAggregateByAtom);
    const sortBy = get(sortByAtom);
    const maxVisible = get(maxVisibleAtom);
    const minVisible = get(minVisibleAtom);
    const hideEmpty = get(hideEmptyAtom);

    return {
      firstAggregateBy,
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
    const secondAggregateBy = get(secondAggregateByAtom);
    const sortBy = get(sortByAtom);
    const maxVisible = get(maxVisibleAtom);
    const minVisible = get(minVisibleAtom);
    const hideEmpty = get(hideEmptyAtom);

    if (val instanceof DefaultValue) {
      reset(firstAggregateByAtom);
      reset(secondAggregateByAtom);
      reset(sortByAtom);
      reset(maxVisibleAtom);
      reset(minVisibleAtom);
      reset(hideEmptyAtom);
    } else {
      if (firstAggregateBy !== val.firstAggregateBy) {
        set(firstAggregateByAtom, val.firstAggregateBy);
      }

      if (secondAggregateBy !== val.secondAggregateBy) {
        set(secondAggregateByAtom, val.secondAggregateBy);
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
