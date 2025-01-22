import { UpsetConfig } from './types';

export const DefaultConfig: UpsetConfig = {
  // Calls to the alttext API may error if these are not set
  plotInformation: {
    description: null,
    sets: null,
    items: null,
    caption: null,
    title: null,
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
  bookmarks: [],
  collapsed: [],
  plots: {
    scatterplots: [],
    histograms: [],
  },
  allSets: [],
  selected: null,
  useUserAlt: false,
  userAltText: null,
  elementSelection: null,
  version: '0.1.1',
  intersectionSizeLabels: true,
  setSizeLabels: true,
  showHiddenSets: true,
};
