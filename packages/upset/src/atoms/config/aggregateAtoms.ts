import { AggregateBy } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { upsetConfigAtom } from './upsetConfigAtoms';

export const firstAggregateSelector = selector<AggregateBy>({
  key: 'fab',
  get: ({ get }) => get(upsetConfigAtom).firstAggregateBy,
});

export const firstOvelapDegreeSelector = selector<number>({
  key: 'fab_degree_selector',
  get: ({ get }) => get(upsetConfigAtom).firstOverlapDegree,
});

export const secondAggregateSelector = selector<AggregateBy>({
  key: 'sab',
  get: ({ get }) => get(upsetConfigAtom).secondAggregateBy,
});

export const secondOverlapDegreeSelector = selector<number>({
  key: 'sab_degree_selector',
  get: ({ get }) => get(upsetConfigAtom).secondOverlapDegree,
});
