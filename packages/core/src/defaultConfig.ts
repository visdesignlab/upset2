import { AttributePlotType, UpsetConfig } from './types';

export const DefaultConfig: UpsetConfig = {
  // Calls to the alttext API may error if these are not set
  plotInformation: {
    description: '',
    sets: '',
    items: '',
    caption: '[Caption]',
    title: '[Title]',
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
  attributePlots: {},
  bookmarkedIntersections: [],
  collapsed: [],
  plots: {
    scatterplots: [],
    histograms: [],
  },
  allSets: [],
  selected: null,
  useUserAlt: false,
};
