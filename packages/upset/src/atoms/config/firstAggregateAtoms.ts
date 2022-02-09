import { AggregateBy } from '@visdesignlab/upset2-core';
import { atom, selector } from 'recoil';

const firstAggregateAtom = atom<AggregateBy>({
  key: 'fab_base',
  default: 'Overlaps',
});

const secondAggregateAtom = atom<AggregateBy>({
  key: 'sab_base',
  default: 'None',
});

export const firstAggregateSelector = selector<AggregateBy>({
  key: 'fab',
  get: ({ get }) => get(firstAggregateAtom),
});

export const secondAggregateSelector = selector<AggregateBy>({
  key: 'sab',
  get: ({ get }) => get(secondAggregateAtom),
});
