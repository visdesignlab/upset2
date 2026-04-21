import { UpsetConfig } from './types';

export const UPSET_ATTS = ['Degree', 'Deviation'];

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
  visibleAttributes: [],
  attributePlots: {},
  bookmarks: [],
  collapsed: [],
  plots: {
    scatterplots: [],
    histograms: [],
  },
  allSets: [],
  rowSelection: null,
  vegaSelection: null,
  querySelection: null,
  selectionType: null,
  userAltText: null,
  version: '0.1.5',
  intersectionSizeLabels: true,
  setSizeLabels: true,
  showHiddenSets: true,
  setQuery: {
    name: '',
    query: {},
  },
};
