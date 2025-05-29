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
 * @param newConf The config object to populate
 * @param data The data object for this config
 * @param visualizeUpsetAttributes Whether or not to visualize UpSet generated attributes
 * @param visibleDataAttributes Attributes that should be visible. If undefined, the first DEFAULT_NUM_ATTRIBUTES are used
 * @returns A new config object with default values populated
 */
export function populateConfigDefaults(
  config: Partial<UpsetConfig>,
  data: CoreUpsetData,
  visualizeUpsetAttributes: boolean,
  visibleDataAttributes: string[] | undefined = undefined,
): UpsetConfig {
  const newConf = {
    ...DefaultConfig,
    // This deepcopy is necessary to avoid mutating the original config object
    ...(Object.entries(config).length > 0 ? deepCopy(convertConfig(config)) : {}),
  };

  if (!newConf.visibleSets || newConf.visibleSets.length === 0) {
    const setList = Object.entries(data.sets);
    newConf.visibleSets = setList.slice(0, DEFAULT_VISIBLE_SETS).map((set) => set[0]); // get first 6 set names
    newConf.allSets = setList.map((set) => ({ name: set[0], size: set[1].size }));
  }

  /**
   * visualizeAttributes can either be undefined or an array of strings.
   * if visualizeAttributes is defined, load the attributes named within. Otherwise, load the first DEFAULT_NUM_ATTRIBUTES.
   */
  if (!newConf.visibleAttributes || newConf.visibleAttributes.length === 0)
    if (visibleDataAttributes) {
      newConf.visibleAttributes = [
        ...(visualizeUpsetAttributes ? UPSET_ATTS : []),
        ...visibleDataAttributes.filter((attr) => data.attributeColumns.includes(attr)),
      ];
    } else {
      newConf.visibleAttributes = [
        ...(visualizeUpsetAttributes ? UPSET_ATTS : []),
        ...data.attributeColumns.slice(0, DEFAULT_NUM_ATTRIBUTES),
      ];
    }

  // Default: a histogram for each attribute if no plots exist
  if (!newConf.plots) newConf.plots = { scatterplots: [], histograms: [] };
  if (!newConf.plots.scatterplots) newConf.plots.scatterplots = [];
  if (!newConf.plots.histograms) newConf.plots.histograms = [];
  if (newConf.plots.histograms.length + newConf.plots.scatterplots.length === 0) {
    newConf.plots.histograms = data.attributeColumns
      .filter((att) => data.columnTypes[att] === 'number' || data.columnTypes[att] === 'date')
      .map((attr) => ({
        attribute: attr,
        bins: 20, // 20 bins is the default used in upset/.../AddPlot.tsx
        type: 'Histogram',
        frequency: false,
        id: Date.now().toString() + attr, // Add the attribute name so that the IDs aren't duplicated
      }));
  }

  if (!isUpsetConfig(newConf)) throw new Error('Config is not a valid UpsetConfig object');
  return newConf;
}
