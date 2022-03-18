import { UpsetConfig } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

export const defaultConfig: UpsetConfig = {
  firstAggregateBy: 'Degree',
  firstOverlapDegree: 2,
  secondAggregateBy: 'None',
  secondOverlapDegree: 2,
  sortBy: 'Cardinality',
  filters: {
    maxVisible: 3,
    minVisible: 0,
    hideEmpty: true,
  },
  visibleSets: [],
  visibleAttributes: [],
  bookmarkedIntersections: [],
};

export const upsetConfigAtom = atom<UpsetConfig>({
  key: 'upsetConfig',
  default: defaultConfig,
});
