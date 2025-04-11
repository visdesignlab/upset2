import {
  AggregateBy, Bookmark, Column, ColumnName, Histogram, PlotInformation, Row, Scatterplot,
  SortByOrder, SortVisibleBy, UpsetConfig,
  AttributePlots,
  AltText, SetQuery,
  QuerySelection,
  VegaSelection,
} from './types';
import { isUpsetConfig } from './typecheck';
import { DefaultConfig } from './defaultConfig';

/**
 * Developer notes:
 * This file is used to convert old versions of the config to the current version.
 * This conversion avoids breaking changes when the config format changes.
 * To add a new version:
 * 1. Copy the old UpsetConfig type into this file and give it a new, unique name.
 * 2. Make your changes to UpsetConfig in types.ts
 * 3. Change the return type of the most recent version conversion function to the old type that you copied.
 * 4. Implement a version conversion function that takes the old type and returns the new type (UpsetConfig).
 *    This function must modify the input config in place; it should not create a new object.
 * 5. Add a new case to the switch statement in convertConfig.
 *    - The case version number should be the current version number, as your conversion function starts
 *      with the previous version (which the current version will become) and converts it to the current version.
 *    - The only statement within the case body should run your conversion function on the `config` var.
 *    - Do not use break statements in the switch, as conversions should be applied cumulatively & in order.
 * 6. Update isUpsetConfig (in typecheck.ts) to reflect your changes to UpsetConfig.
 * 7. Bump the version number in the UpsetConfig type, all package.json files, the README, and defaultConfig.ts.
 */

// Old types, pre-0.1.2

type ElementBookmark = Omit<Bookmark, 'size'> & {
  /**
   * Selection parameters
   */
  selection: QuerySelection;
  /**
   * Indicates type at runtim
   */
  type: 'element';
}

type NumericalBookmark = Omit<Bookmark, 'size'> & {
  /**
   * The selection parameters
   */
  selection: VegaSelection;
  /**
   * Indicates type at runtime
   */
  type: 'numerical';
}

type ElementSelection = NumericalBookmark | ElementBookmark;

// Old types, pre-0.1.4

/**
 * Wrapper type for an element query
 */
type AttSelection_013 = {
  type: 'element';
  query: QuerySelection;
  active: boolean;
}

/**
 * Wrapper type for a numerical query
 */
type NumericalSelection_013 = {
  type: 'numerical';
  query: VegaSelection;
  active: boolean;
}

/**
 * Represents a selection of elements.
 * Can be either an element query or a numerical query.
 * Active is true if the selection is currently being applied to the plot;
 * an inactive selection shows as a deselected chip in the element view.
 */
type ElementSelection_013 = AttSelection_013 | NumericalSelection_013;

type Version0_1_0 = {
  plotInformation: PlotInformation;
    horizontal: boolean;
    firstAggregateBy: AggregateBy;
    firstOverlapDegree: number;
    secondAggregateBy: AggregateBy;
    secondOverlapDegree: number;
    sortVisibleBy: SortVisibleBy;
    sortBy: string;
    sortByOrder: SortByOrder;
    filters: {
      maxVisible: number;
      minVisible: number;
      hideEmpty: boolean;
      hideNoSet: boolean;
    };
    visibleSets: ColumnName[];
    visibleAttributes: ColumnName[];
    attributePlots: AttributePlots;
    bookmarks: Bookmark[];
    collapsed: string[];
    plots: {
      scatterplots: Scatterplot[];
      histograms: Histogram[];
    };
    allSets: Column[];
    selected: Row | null;
    elementSelection: ElementSelection | null;
    version: '0.1.0';
    useUserAlt: boolean;
    userAltText: AltText | null;
}

type Version0_1_1 = {
  plotInformation: PlotInformation;
  horizontal: boolean;
  firstAggregateBy: AggregateBy;
  firstOverlapDegree: number;
  secondAggregateBy: AggregateBy;
  secondOverlapDegree: number;
  sortVisibleBy: SortVisibleBy;
  sortBy: string;
  sortByOrder: SortByOrder;
  filters: {
    maxVisible: number;
    minVisible: number;
    hideEmpty: boolean;
    hideNoSet: boolean;
  };
  visibleSets: ColumnName[];
  visibleAttributes: ColumnName[];
  attributePlots: AttributePlots;
  bookmarks: Bookmark[];
  collapsed: string[];
  plots: {
    scatterplots: Scatterplot[];
    histograms: Histogram[];
  };
  allSets: Column[];
  selected: Row | null;
  elementSelection: ElementSelection | null;
  version: '0.1.1';
  useUserAlt: boolean;
  userAltText: AltText | null;
  intersectionSizeLabels: boolean;
  setSizeLabels: boolean;
  showHiddenSets: boolean;
}

type Version0_1_2 = {
  plotInformation: PlotInformation;
  horizontal: boolean;
  firstAggregateBy: AggregateBy;
  firstOverlapDegree: number;
  secondAggregateBy: AggregateBy;
  secondOverlapDegree: number;
  sortVisibleBy: SortVisibleBy;
  sortBy: string;
  sortByOrder: SortByOrder;
  filters: {
    maxVisible: number;
    minVisible: number;
    hideEmpty: boolean;
    hideNoSet: boolean;
  };
  visibleSets: ColumnName[];
  visibleAttributes: ColumnName[];
  attributePlots: AttributePlots;
  bookmarks: Bookmark[];
  collapsed: string[];
  plots: {
    scatterplots: Scatterplot[];
    histograms: Histogram[];
  };
  allSets: Column[];
  selected: Row | null;
  elementSelection: ElementSelection | null;
  version: '0.1.2';
  useUserAlt: boolean;
  userAltText: AltText | null;
  intersectionSizeLabels: boolean;
  setSizeLabels: boolean;
  showHiddenSets: boolean;
  setQuery: SetQuery | null;
}

type Version0_1_3 = {
  plotInformation: PlotInformation;
  horizontal: boolean;
  firstAggregateBy: AggregateBy;
  firstOverlapDegree: number;
  secondAggregateBy: AggregateBy;
  secondOverlapDegree: number;
  sortVisibleBy: SortVisibleBy;
  sortBy: string;
  sortByOrder: SortByOrder;
  filters: {
    maxVisible: number;
    minVisible: number;
    hideEmpty: boolean;
    hideNoSet: boolean;
  };
  visibleSets: ColumnName[];
  visibleAttributes: ColumnName[];
  attributePlots: AttributePlots;
  bookmarks: Bookmark[];
  collapsed: string[];
  plots: {
    scatterplots: Scatterplot[];
    histograms: Histogram[];
  };
  allSets: Column[];
  selected: Row | null;
  elementSelection: ElementSelection_013 | null;
  version: '0.1.3';
  userAltText: AltText | null;
  intersectionSizeLabels: boolean;
  setSizeLabels: boolean;
  showHiddenSets: boolean;
  setQuery: SetQuery | null;
};

/**
 * Config type before versioning was implemented.
 */
type PreVersionConfig = {
  plotInformation: PlotInformation;
  horizontal: boolean;
  firstAggregateBy: AggregateBy;
  firstOverlapDegree: number;
  secondAggregateBy: AggregateBy;
  secondOverlapDegree: number;
  sortVisibleBy: SortVisibleBy;
  sortBy: string;
  sortByOrder: SortByOrder;
  filters: {
    maxVisible: number;
    minVisible: number;
    hideEmpty: boolean;
    hideNoSet: boolean;
  };
  visibleSets: ColumnName[];
  visibleAttributes: ColumnName[];
  bookmarkedIntersections: Bookmark[];
  collapsed: string[];
  plots: {
    scatterplots: Scatterplot[];
    histograms: Histogram[];
  };
  allSets: Column[];
  selected: Row | null;
  elementSelection: NumericalBookmark | null;
};

/**
 * Converts a 0.1.0 config to the current version.
 * @param config The config to convert.
 * @returns The converted config.
 */
// eslint-disable-next-line camelcase
function convert0_1_0(config: Version0_1_0): Version0_1_1 {
  (config as unknown as Version0_1_1).version = '0.1.1';
  (config as unknown as Version0_1_1).intersectionSizeLabels = DefaultConfig.intersectionSizeLabels;
  (config as unknown as Version0_1_1).setSizeLabels = DefaultConfig.setSizeLabels;
  (config as unknown as Version0_1_1).showHiddenSets = DefaultConfig.showHiddenSets;
  return (config as unknown as Version0_1_1);
}

/**
 * Converts a configuration object from version 0.1.1 to version 0.1.2.
 *
 * @param config - The configuration object of version 0.1.1 to be converted.
 * @returns The updated configuration object with version 0.1.2.
 */
// eslint-disable-next-line camelcase
function convert0_1_1(config: Version0_1_1): Version0_1_2 {
  (config as unknown as Version0_1_2).version = '0.1.2';
  (config as unknown as Version0_1_2).setQuery = DefaultConfig.setQuery;
  return config as unknown as Version0_1_2;
}

/**
 * Converts a configuration object from version 0.1.2 to version 0.1.3.
 */
// eslint-disable-next-line camelcase
function convert0_1_2(config: Version0_1_2): Version0_1_3 {
  delete (config as any).useUserAlt;
  const bookmarks = config.bookmarks.filter(
    (bookmark) => (bookmark as any).type === 'intersection' || (bookmark as any).type === undefined,
  );
  config.bookmarks = bookmarks;
  (config as unknown as Version0_1_3).version = '0.1.3';
  if (config.elementSelection && config.elementSelection.id) {
    (config.elementSelection as any).query = config.elementSelection.selection;
    delete (config.elementSelection as any).selection;
    delete (config.elementSelection as any).id;
    delete (config.elementSelection as any).label;
    (config.elementSelection as any).active = true;
  }
  return config as unknown as Version0_1_3;
}

/**
 * Converts a configuration object from version 0.1.3 to version 0.1.4.
 */
// eslint-disable-next-line camelcase
function convert0_1_3(config: Version0_1_3): UpsetConfig {
  (config as unknown as UpsetConfig).version = '0.1.4';
  (config as unknown as UpsetConfig).rowSelection = config.selected;

  if (config.elementSelection?.type === 'numerical') {
    (config as unknown as UpsetConfig).querySelection = null;
    (config as unknown as UpsetConfig).vegaSelection = config.elementSelection.query;
    if (config.elementSelection.active) (config as unknown as UpsetConfig).selectionType = 'vega';
    else (config as unknown as UpsetConfig).selectionType = config.selected ? 'row' : null;
  } else if (config.elementSelection?.type === 'element') {
    (config as unknown as UpsetConfig).vegaSelection = null;
    (config as unknown as UpsetConfig).querySelection = config.elementSelection.query;
    if (config.elementSelection.active) (config as unknown as UpsetConfig).selectionType = 'query';
    else (config as unknown as UpsetConfig).selectionType = config.selected ? 'row' : null;
  } else {
    (config as unknown as UpsetConfig).vegaSelection = null;
    (config as unknown as UpsetConfig).querySelection = null;
    (config as unknown as UpsetConfig).selectionType = config.selected ? 'row' : null;
  }

  config.bookmarks = config.bookmarks.map((b, i) => ({ ...b, colorIndex: i }));

  delete (config as any).elementSelection;
  delete (config as any).selected;
  return config as unknown as UpsetConfig;
}

/**
 * Converts a pre-versioned config to the current version.
 * @param config The config to convert.
 * @returns The converted config.
 */
function preVersionConversion(config: PreVersionConfig): Version0_1_0 {
  // TS won't allow a conversion directly to UpsetConfig, so we have to cast it to unknown first.
  // This is necessary to add and remove properties from the object.
  (config as unknown as Version0_1_0).version = '0.1.0';
  (config as unknown as Version0_1_0).elementSelection = null;
  (config as unknown as Version0_1_0).bookmarks = config.bookmarkedIntersections;
  (config as unknown as Version0_1_0).userAltText = DefaultConfig.userAltText;
  (config as unknown as Version0_1_0).attributePlots = DefaultConfig.attributePlots;
  // Any cast required because bookmarkedIntersections isn't optional in PreversionConfig
  delete (config as any).bookmarkedIntersections;

  return config as unknown as Version0_1_0;
}

/**
 * Converts a config, of any version, to the current version.
 * This is done in-place, so the input config will be modified and returned.
 * Outputs a console error if the after-conversion config is invalid;
 * this should not happen in practice but if it does, there will likely be other errors downstream.
 * @param config The config to convert.
 * @returns {UpsetConfig} The converted config; the same object as the input config.
 */
export function convertConfig(config: unknown): UpsetConfig {
  if (typeof config !== 'object' || !config) throw new Error('Config must be an object');
  // Special case for pre-versioning configs
  if (!Object.hasOwn(config, 'version')) preVersionConversion(config as PreVersionConfig);

  /* eslint-disable no-void */
  // Switch case is designed to fallthrough to the next version's conversion function
  // so that all versions are converted cumulatively.

  switch ((config as {version: string}).version) {
    /* eslint-disable no-fallthrough */
    // @ts-expect-error: Fallthrough is intended behavior. This is needed because Typescript build is not parsing eslint flags
    case '0.1.0':
      convert0_1_0(config as Version0_1_0);
    // @ts-expect-error: Fallthrough is intended behavior.
    case '0.1.1':
      convert0_1_1(config as Version0_1_1);
    // @ts-expect-error: Fallthrough is intended behavior.
    case '0.1.2':
      convert0_1_2(config as Version0_1_2);
    // @ts-expect-error: Fallthrough is intended behavior.
    case '0.1.3':
      convert0_1_3(config as Version0_1_3);
    default:
      void 0;
    /* eslint-enable no-fallthrough */
  }

  if (!isUpsetConfig(config)) {
    // eslint-disable-next-line no-console
    console.error('Invalid config output from conversion', config);
  }
  return config as UpsetConfig;
}
