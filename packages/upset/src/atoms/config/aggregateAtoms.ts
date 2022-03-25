import { AggregateBy } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { upsetConfigAtom } from './upsetConfigAtoms';

export const firstAggregateSelector = selector<AggregateBy>({
  key: 'first-aggregate',
  get: ({ get }) => get(upsetConfigAtom).firstAggregateBy,
});

export const firstOvelapDegreeSelector = selector<number>({
  key: 'first-aggregate-degree-selector',
  get: ({ get }) => get(upsetConfigAtom).firstOverlapDegree,
});

export const secondAggregateSelector = selector<AggregateBy>({
  key: 'second-aggregate',
  get: ({ get }) => get(upsetConfigAtom).secondAggregateBy,
});

export const secondOverlapDegreeSelector = selector<number>({
  key: 'second-aggregate-degree-selector',
  get: ({ get }) => get(upsetConfigAtom).secondOverlapDegree,
});
