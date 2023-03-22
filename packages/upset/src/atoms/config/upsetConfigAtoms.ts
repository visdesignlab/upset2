import { UpsetConfig } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

export const defaultConfig: UpsetConfig = {
  firstAggregateBy: 'None',
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
  collapsed: [],
  plots: {
    scatterplots: [],
    histograms: [],
    wordClouds: [],
  },
};

export const upsetConfigAtom = atom<UpsetConfig>({
  key: 'upset-config',
  default: defaultConfig,
});
