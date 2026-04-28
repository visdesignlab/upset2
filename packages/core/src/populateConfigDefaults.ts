import { convertConfig } from './convertConfig';
import { DefaultConfig, UPSET_ATTS } from './defaultConfig';
import { isUpsetConfig } from './typecheck';
import { CoreUpsetData, UpsetConfig } from './types';
import { deepCopy } from './utils';

/** Number of atts to show by default */
const DEFAULT_NUM_ATTRIBUTES = 3;
/** Number of sets to show by default */
const DEFAULT_VISIBLE_SETS = 6;

/**
 * Takes a config object and populates it with default values if not already set
 * Has no effect on configs with default values already set
 * Does not modify the original config object passed in
 *
 * WARNING: this should NOT be called repeatedly during the same session, as it can overwrite changes to the config.
 * This should be used to set defaults when creating a new session/config/provenance
 * @param newConf The config object to populate
 * @param data The data object for this config
 * @param visualizeUpsetAttributes Whether or not to visualize UpSet generated attributes
 * @param visibleDataAttributes Attributes that should be visible. If undefined, the first DEFAULT_NUM_ATTRIBUTES are used
 * @returns A new config object with default values populated
 *
 */
export function populateConfigDefaults(
  config: Partial<UpsetConfig>,
  data: CoreUpsetData,
  visualizeUpsetAttributes: boolean,
  visibleDataAttributes: string[] | undefined = undefined,
): UpsetConfig {
  const newConf = {
    // This deepycopy is required to avoid readonly issues for nested objects
    ...deepCopy(DefaultConfig),
    // This deepcopy is necessary to avoid mutating the original config object
    ...(Object.entries(config).length > 0 ? deepCopy(convertConfig(config)) : {}),
  };

  if (!newConf.visibleSets || newConf.visibleSets.length === 0) {
    const setList = Object.entries(data.sets);
    newConf.visibleSets = setList.slice(0, DEFAULT_VISIBLE_SETS).map((set) => set[0]);
    newConf.allSets = setList.map((set) => ({ name: set[0], size: set[1].size }));
  }

  if (!newConf.visibleAttributes || newConf.visibleAttributes.length === 0) {
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
  }

  if (!newConf.plots) newConf.plots = { scatterplots: [], histograms: [] };
  if (!newConf.plots.histograms.length && !newConf.plots.scatterplots.length) {
    if (!newConf.plots.histograms) newConf.plots.histograms = [];
    newConf.plots.histograms = data.attributeColumns
      .filter(
        (att) => data.columnTypes[att] === 'number' || data.columnTypes[att] === 'date',
      )
      .map((attr) => ({
        attribute: attr,
        bins: 20,
        type: 'Histogram',
        frequency: false,
        id: Date.now().toString() + attr,
      }));
  }

  if (!isUpsetConfig(newConf)) throw new Error('Config is not a valid UpsetConfig object');
  return newConf;
}
