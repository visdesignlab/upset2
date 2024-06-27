import { UpsetConfig } from './types';

export const DefaultConfig: UpsetConfig = {
  plotInformation: {
    description: '',
    sets: '',
    items: '',
  },
  horizontal: false,
  firstAggregateBy: 'None',
  firstOverlapDegree: 2,
  secondAggregateBy: 'None',
  secondOverlapDegree: 2,
  sortVisibleBy: 'Alphabetical',
  sortBy: 'Size',
  sortByOrder: 'Descending',
  filters: {
    maxVisible: 6,
    minVisible: 0,
    hideEmpty: true,
    hideNoSet: false,
  },
  visibleSets: [],
  visibleAttributes: ['Degree', 'Deviation'],
  bookmarks: [],
  collapsed: [],
  plots: {
    scatterplots: [],
    histograms: [],
  },
  allSets: [],
  selected: null,
  elementSelection: null,
  version: '0.1.0',
};
