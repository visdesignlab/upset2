import { UpsetConfig } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

// This config is overruled by any config provided by an external source
export const defaultConfig: UpsetConfig = {
  metaData: {
    description: 'An UpSet 2 Plot',
    sets: 'sets',
    items: 'items',
  },
  firstAggregateBy: 'None',
  firstOverlapDegree: 2,
  secondAggregateBy: 'None',
  secondOverlapDegree: 2,
  sortVisibleBy: 'Alphabetical',
  sortBy: 'Size',
  filters: {
    maxVisible: 3,
    minVisible: 0,
    hideEmpty: true,
    hideNoSet: false,
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
  allSets: [],
  altText: {
    verbosity: 'low',
    explain: 'full',
  },
};

export const upsetConfigAtom = atom<UpsetConfig>({
  key: 'upset-config',
  default: defaultConfig,
});
