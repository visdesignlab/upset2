import { convertConfig } from './convertConfig';
import { AttributePlotType, CoreUpsetData, UpsetConfig } from './types';
import { isUpsetConfig } from './typecheck';
import { deepCopy } from './utils';

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
  visibleAttributes: UPSET_ATTS,
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
  version: '0.1.4',
  intersectionSizeLabels: true,
  setSizeLabels: true,
  showHiddenSets: true,
  setQuery: {
    name: '',
    query: {},
  },
};

/** Number of atts to show by default */
const DEFAULT_NUM_ATTRIBUTES = 3;
/** Number of sets to show by default */
const DEFAULT_VISIBLE_SETS = 6;

/**
 * Takes a config object and populates it with default values if not already set
 * Has no effect on configs with default values already set
 * Does not modify the original config object passed in
 * @param config The config object to populate
 * @param data The data object for this config
 * @param visualizeUpsetAttributes Whether or not to visualize UpSet generated attributes
 * @param visibleDataAttributes Attributes that should be visible. If undefined, the first DEFAULT_NUM_ATTRIBUTES are used
 * @returns A new config object with default values populated
 */
export function populateConfigDefaults(
  config: Partial<UpsetConfig>,
  data: CoreUpsetData,
  visualizeUpsetAttributes: boolean,
  visibleDataAttributes: string[] | undefined,
): UpsetConfig {
  config = {
    ...DefaultConfig,
    ...(Object.entries(config).length > 0 ? convertConfig(config) : {}),
  };

  if (!config.visibleSets || config.visibleSets.length === 0) {
    const setList = Object.entries(data.sets);
    config.visibleSets = setList.slice(0, DEFAULT_VISIBLE_SETS).map((set) => set[0]); // get first 6 set names
    config.allSets = setList.map((set) => ({ name: set[0], size: set[1].size }));
  }

  /**
   * visualizeAttributes can either be undefined or an array of strings.
   * if visualizeAttributes is defined, load the attributes named within. Otherwise, load the first DEFAULT_NUM_ATTRIBUTES.
   */
  if (!config.visibleAttributes || config.visibleAttributes.length === 0)
    if (visibleDataAttributes) {
      config.visibleAttributes = [
        ...(visualizeUpsetAttributes ? UPSET_ATTS : []),
        ...visibleDataAttributes.filter((attr) => data.attributeColumns.includes(attr)),
      ];
    } else {
      config.visibleAttributes = [
        ...(visualizeUpsetAttributes ? UPSET_ATTS : []),
        ...data.attributeColumns.slice(0, DEFAULT_NUM_ATTRIBUTES),
      ];
    }

  // for every visible attribute other than deviation and degree, set their initial attribute plot type to 'Box Plot'
  config.attributePlots = deepCopy(config.attributePlots ?? {});
  config.visibleAttributes.forEach((attr) => {
    // @ts-expect-error attributePlots is guaranteed to exist... why doesn't TS know this??
    if (attr !== 'Degree' && attr !== 'Deviation' && !config.attributePlots[attr]) {
      // @ts-expect-error attributePlots is guaranteed to exist... why doesn't TS know this??
      config.attributePlots[attr] = AttributePlotType.DensityPlot;
    }
  });

  if (!isUpsetConfig(config)) throw new Error('Config is not a valid UpsetConfig object');
  return config;
}
