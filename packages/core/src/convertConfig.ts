import { AggregateBy, Bookmark, BookmarkedSelection, Column, ColumnName, Histogram, PlotInformation, Row, Scatterplot, 
  SortByOrder, SortVisibleBy, UpsetConfig } from "@visdesignlab/upset2-core";

/**
 * Developer notes:
 * This file is used to convert old versions of the config to the current version.
 * This conversion avoids breaking changes when the config format changes.
 * To add a new version:
 * 1. Copy the old UpsetConfig type into this file and give it a new, unique name.
 * 2. Make your changes to UpsetConfig in types.ts
 * 3. Change the return type of the most recent version conversion function to the old type that you copied.
 * 4. Implement a version conversion function that takes the old type and returns the new type (UpsetConfig).
 * 5. Add a new case to the switch statement in convertConfig.
 *    - The case version number should be the current version number, as your conversion function starts 
 *      with the previous version (which the current version will become) and converts it to the current version.
 *    - The only statement within the case body should assign param `config` to the result of your conversion function.
 *    - Do not use break statements in the switch, as conversions should be applied cumulatively & in order.
 * 6. Update isUpsetConfig to reflect your changes to UpsetConfig.
 * 7. Bump the version number in the UpsetConfig type, all package.json files, the README, and defaultConfig.ts.
 */

/**
 * Converts a config, of any version, to the current version.
 * @param config The config to convert.
 * @throws {Error} If the config is not an object or programmer error leads to an invalid config at return.
 * @returns {UpsetConfig}
 */
export function convertConfig(config: unknown): UpsetConfig {
  if (typeof config !== 'object' || !config) throw new Error('Config must be an object');
  // Special case for pre-versioning configs
  if (!Object.hasOwn(config, 'version')) config = preVersionConversion(config as PreVersionConfig);

  switch ((config as {version: string}).version) {
    case '0.1.0':
      void 0; // This will be replaced by the next version's conversion function
  }

  if (!isUpsetConfig(config)) throw new Error('Invalid config output from conversion');

  return config;
}

/**
 * Converts a pre-versioned config to the current version.
 * @param config The config to convert.
 * @returns The converted config.
 */
function preVersionConversion(config: PreVersionConfig): UpsetConfig {
  let result = {...config, version: '0.1.0', bookmarks: config.bookmarkedIntersections};
  delete (result as UpsetConfig & {bookmarkedIntersections?: any}).bookmarkedIntersections;
  return result as UpsetConfig;
}

/**
 * Determines if the given object is a valid UpsetConfig using the CURRENT version.
 * This needs to be updated each time a new version is added.
 * @param config The object to check.
 * @returns {boolean} Whether the object is a valid UpsetConfig.
 */
function isUpsetConfig(config: unknown): config is UpsetConfig {
  return !!config
  && typeof config === 'object'
  && Object.hasOwn(config, 'plotInformation')
  && Object.hasOwn(config, 'horizontal')
  && Object.hasOwn(config, 'firstAggregateBy')
  && Object.hasOwn(config, 'firstOverlapDegree')
  && Object.hasOwn(config, 'secondAggregateBy')
  && Object.hasOwn(config, 'secondOverlapDegree')
  && Object.hasOwn(config, 'sortVisibleBy')
  && Object.hasOwn(config, 'sortBy')
  && Object.hasOwn(config, 'sortByOrder')
  && Object.hasOwn(config, 'filters')
  && Object.hasOwn(config, 'visibleSets')
  && Object.hasOwn(config, 'visibleAttributes')
  && Object.hasOwn(config, 'bookmarks')
  && Object.hasOwn(config, 'collapsed')
  && Object.hasOwn(config, 'plots')
  && Object.hasOwn(config, 'allSets')
  && Object.hasOwn(config, 'selected')
  && Object.hasOwn(config, 'elementSelection')
  && Object.hasOwn(config, 'version');
}

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
  elementSelection: BookmarkedSelection | null;
};