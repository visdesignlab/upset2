import { Aggregate, AggregateBy, aggregateByList, AltText, BaseElement, BaseIntersection, Bookmark, BookmarkedSelection, Column, ElementSelection, Histogram, PlotInformation, Row, Scatterplot, Subset, Subsets, UpsetConfig } from "./types";
import { deepCopy } from "./utils";

/**
 * Determines if the given object is a valid UpsetConfig using the CURRENT version.
 * @privateRemarks 
 * This needs to be updated each time a new version is added. Since it's intended to be an exhaustive 
 * type guard against unknown types coming in, you cannot make any assumptions about the shape of the input config-
 * exhastively check every property of new fields that you add to the config.
 * @param config The object to check.
 * @returns {boolean} Whether the object is a valid UpsetConfig.
 */
export function isUpsetConfig(config: unknown): config is UpsetConfig {
  if (!(
    !!config
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
    && Object.hasOwn(config, 'version')
    && Object.hasOwn(config, 'useUserAlt')
    && Object.hasOwn(config, 'userAltText')
  )) {
    console.warn('Upset config is missing required fields');
    return false;
  }
    

  // Put fields we've confirmed exist into vars to avoid repeating necessary casts
  const { plotInformation, horizontal, firstAggregateBy, firstOverlapDegree, secondAggregateBy, secondOverlapDegree,
    sortVisibleBy, sortBy, sortByOrder, filters, visibleSets, visibleAttributes, bookmarks, collapsed, plots, allSets,
    selected, elementSelection, version, useUserAlt, userAltText } = config as UpsetConfig;

  // Check that the fields are of the correct type
  // Start with plot info
  if (typeof plotInformation !== 'object') {
    console.warn('Upset config error: Plot information is not an object');
    return false;
  }
  if (!Object.hasOwn(plotInformation, 'description')) {
    console.warn('Upset config error: Plot information missing description');
    return false;
  }
  if (!Object.hasOwn(plotInformation, 'sets')) {
    console.warn('Upset config error: Plot information missing sets');
    return false;
  }
  if (!Object.hasOwn(plotInformation, 'items')) {
    console.warn('Upset config error: Plot information missing items');
    return false;
  }
  if (typeof (plotInformation as PlotInformation).description !== 'string') {
    console.warn('Upset config error: Plot description is not a string');
    return false;
  }
  if (typeof (plotInformation as PlotInformation).sets !== 'string') {
    console.warn('Upset config error: Plot sets is not a string');
    return false;
  }
  if (typeof (plotInformation as PlotInformation).items !== 'string') {
    console.warn('Upset config error: Plot items is not a string');
    return false;
  }
  
  // horizontal
  if (typeof horizontal !== 'boolean') {
    console.warn('Upset config error: Horizontal is not a boolean');
    return false;
  }

  // firstAggregateBy
  if (!isAggregateBy(firstAggregateBy)) {
    console.warn('Upset config error: Invalid first aggregate by');
    return false;
  }

  // firstOverlapDegree
  if (typeof firstOverlapDegree !== 'number') {
    console.warn('Upset config error: First overlap degree is not a number');
    return false;
  }

  // secondAggregateBy
  if (!isAggregateBy(secondAggregateBy)) {
    console.warn('Upset config error: Invalid second aggregate by');
    return false;
  }

  // secondOverlapDegree
  if (typeof secondOverlapDegree !== 'number') {
    console.warn('Upset config error: Second overlap degree is not a number');
    return false;
  }

  // sortVisibleBy
  if (!(sortVisibleBy === 'Alphabetical'|| sortVisibleBy === 'Ascending'
    || sortVisibleBy === 'Descending')) {
    console.warn('Upset config error: Invalid sort visible by');
    return false;
  }

  // sortBy
  if (typeof sortBy !== 'string') {
    console.warn('Upset config error: Sort by is not a string');
    return false;
  }

  // sortByOrder
  if (!(sortByOrder === 'Ascending' || sortByOrder === 'Descending')) {
    console.warn('Upset config error: Invalid sort by order');
    return false;
  }

  // filters
  if (typeof filters !== 'object') {
    console.warn('Upset config error: Filters is not an object');
    return false;
  }
  if (!Object.hasOwn(filters, 'maxVisible')) {
    console.warn('Upset config error: Filters missing max visible');
    return false;
  }
  if (!Object.hasOwn(filters, 'minVisible')) {
    console.warn('Upset config error: Filters missing min visible');
    return false;
  }
  if (!Object.hasOwn(filters, 'hideEmpty')) {
    console.warn('Upset config error: Filters missing hide empty');
    return false;
  }
  if (!Object.hasOwn(filters, 'hideNoSet')) {
    console.warn('Upset config error: Filters missing hide no set');
    return false;
  }
  if (typeof filters.maxVisible !== 'number') {
    console.warn('Upset config error: Max visible is not a number');
    return false;
  }
  if (typeof filters.minVisible !== 'number') {
    console.warn('Upset config error: Min visible is not a number');
    return false;
  }
  if (typeof filters.hideEmpty !== 'boolean') {
    console.warn('Upset config error: Hide empty is not a boolean');
    return false;
  }
  if (typeof filters.hideNoSet !== 'boolean') {
    console.warn('Upset config error: Hide no set is not a boolean');
    return false;
  }
  // visibleSets
  if (!Array.isArray(visibleSets)) {
    console.warn('Upset config error: Visible sets is not an array');
    return false;
  }
  if (!visibleSets.every(s => typeof s === 'string')) {
    console.warn('Upset config error: Visible sets contains non-strings');
    return false;
  }
  // visibleAttributes
  if (!Array.isArray(visibleAttributes)) {
    console.warn('Upset config error: Visible attributes is not an array');
    return false;
  }
  if (!visibleAttributes.every(a => typeof a === 'string')) {
    console.warn('Upset config error: Visible attributes contains non-strings');
    return false;
  }
  // bookmarks
  if (!Array.isArray(bookmarks)) {
    console.warn('Upset config error: Bookmarks is not an array');
    return false;
  }
  if (!bookmarks.every(b => isBookmark(b))) {
    console.warn('Upset config error: Bookmarks contains invalid bookmarks');
    return false;
  }
  // collapsed
  if (!Array.isArray(collapsed)) {
    console.warn('Upset config error: Collapsed is not an array');
    return false;
  }
  if (!collapsed.every(c => typeof c === 'string')) {
    console.warn('Upset config error: Collapsed contains non-strings');
    return false;
  }
  // plots
  if (typeof plots !== 'object') {
    console.warn('Upset config error: Plots is not an object');
    return false;
  }
  if (!Object.hasOwn(plots, 'scatterplots')) {
    console.warn('Upset config error: Plots missing scatterplots');
    return false;
  }
  if (!Object.hasOwn(plots, 'histograms')) {
    console.warn('Upset config error: Plots missing histograms');
    return false;
  }
  if (!Array.isArray(plots.scatterplots)) {
    console.warn('Upset config error: Scatterplots is not an array');
    return false;
  }
  if (!Array.isArray(plots.histograms)) {
    console.warn('Upset config error: Histograms is not an array');
    return false;
  }
  if (!plots.scatterplots.every(s => isScatterplot(s))) {
    console.warn('Upset config error: Scatterplots contains invalid scatterplots');
    return false;
  }
  if (!plots.histograms.every(h => isHistogram(h))) {
    console.warn('Upset config error: Histograms contains invalid histograms');
    return false;
  }

  // allSets
  if (!Array.isArray(allSets)) {
    console.warn('Upset config error: All sets is not an array');
    return false;
  }
  if (!allSets.every(s => isColumn(s))) {
    console.warn('Upset config error: All sets contains invalid sets');
    return false;
  }

  // selected
  if (!(selected === null || isRow(selected))) {
    console.warn('Upset config error: Selected is not a row');
    return false;
  }

  // elementSelection
  if (!(elementSelection === null || isBookmarkedSelection(elementSelection))) {
    console.warn('Upset config error: Element selection is not a bookmarked selection');
    return false;
  }

  // version
  if (version !== '0.1.0') {
    console.warn('Upset config error: Invalid version');
    return false;
  }

  // useUserAlt
  if (typeof useUserAlt !== 'boolean') {
    console.warn('Upset config error: Use user alt is not a boolean');
    return false;
  }

  // userAltText
  if (userAltText !== null && !isAltText(userAltText)) {
    console.warn('Upset config error: User alt text is not correct');
    return false;
  }

  return true;
}

/**
 * Type guard for AltText
 * @param val The value to check
 * @returns {boolean} whether val is an AltText
 */
export function isAltText(val: unknown): val is AltText {
  return (
    !!val
    && typeof val === 'object'
    && Object.hasOwn(val, 'longDescription')
    && Object.hasOwn(val, 'shortDescription')
    && typeof (val as AltText).longDescription === 'string'
    && typeof (val as AltText).shortDescription === 'string'
  )
}

/**
 * Validates that the given value is an ElementSelection.
 * @param value The value to check.
 * @returns whether the value is an ElementSelection.
 */
export function isElementSelection(value: unknown): value is ElementSelection {
  return (
    !!value
    && typeof value === 'object'
    && Object.values(value).every((v) => Array.isArray(v)
          && v.length === 2
          && typeof v[0] === 'number'
          && typeof v[1] === 'number')
  );
}

/**
 * Type guard for Scatterplot
 * @param s variable to check
 * @returns {boolean}
 */
export function isScatterplot(s: unknown): s is Scatterplot {
  return (
    !!s
    && typeof s === 'object'
    && Object.hasOwn(s, 'type')
    && Object.hasOwn(s, 'x')
    && Object.hasOwn(s, 'y')
    && (s as Scatterplot).type === 'Scatterplot'
    && typeof (s as Scatterplot).x === 'string'
    && typeof (s as Scatterplot).y === 'string'
  );
}

/**
 * Type guard for Histogram
 * @param h variable to check
 * @returns {boolean}
 */
export function isHistogram(h: unknown): h is Histogram {
  return !!h
    && typeof h === 'object' 
    && Object.hasOwn(h, 'attribute')
    && Object.hasOwn(h, 'type')
    && Object.hasOwn(h, 'bins')
    && Object.hasOwn(h, 'frequency')
    && (h as Histogram).type === 'Histogram'
    && typeof (h as Histogram).attribute === 'string'
    && typeof (h as Histogram).bins === 'number'
    && typeof (h as Histogram).frequency === 'boolean'
}

/**
 * Type guard for Bookmark
 * @param b variable to check
 * @returns {boolean}
 */
export function isBookmark(b: unknown): b is Bookmark {
  return !!b
    && typeof b === 'object' 
    && Object.hasOwn(b, 'id') 
    && Object.hasOwn(b, 'label')
    && Object.hasOwn(b, 'type')
    && typeof (b as Bookmark).id === 'string'
    && typeof (b as Bookmark).label === 'string'
    && ((b as Bookmark).type === 'intersection' || (b as Bookmark).type === 'elements')
}

/**
 * Type guard for Column
 * @param c variable to check
 * @returns {boolean}
 */
export function isColumn(c: unknown): c is Column {
  return !!c
    && typeof c === 'object'
    && Object.hasOwn(c, 'name')
    && Object.hasOwn(c, 'size')
    && typeof (c as Column).name === 'string'
    && typeof (c as Column).size === 'number'
}

/**
 * Type guard for aggregateBy
 * @param a variable to check
 * @returns {boolean}
 */
export function isAggregateBy(a: unknown): a is AggregateBy {
  return aggregateByList.includes(a as AggregateBy);
}

/**
 * Type guard for Subsets
 * @param s variable to check
 * @returns {boolean}
 */
export function isSubsets(s: unknown): s is Subsets {
  return !!s
    && typeof s === 'object'
    && Object.hasOwn(s, 'values')
    && Object.hasOwn(s, 'order')
    && typeof (s as Subsets).values === 'object'
    && Array.isArray((s as Subsets).order)
    && Object.entries((s as Subsets).values).every((k, v) => typeof k === 'string' && isSubset(v))
    && (s as Subsets).order.every((o: unknown) => typeof o === 'string')
}

/**
 * Type guard for Row
 * @param r variable to check
 * @returns {boolean}
 */
export function isRow(r: unknown): r is Row {
  return isSubset(r) || isAggregate(r);
}

/**
 * Type guard for Aggregate
 * @param a variable to check
 * @returns {boolean}
 */
export function isAggregate(a: unknown): a is Aggregate {
  // Dupe the items field because BaseIntersection has a different items definition,
  // then check if it is a BaseIntersection
  let dupeA = deepCopy(a);
  (dupeA as { items: string[]}).items = [];
  if (!isBaseIntersection(dupeA)) return false;

  // We can now assume a is an object, but I add type guards here for the compiler
  return !!a && typeof a === 'object'
    && Object.hasOwn(a, 'aggregateBy')
    && Object.hasOwn(a, 'level')
    && Object.hasOwn(a, 'description')
    && Object.hasOwn(a, 'items')
    && isAggregateBy((a as Aggregate).aggregateBy)
    && typeof (a as Aggregate).level === 'number'
    && typeof (a as Aggregate).description === 'string'
    && (isSubsets((a as Aggregate).items)
      || (typeof (a as Aggregate).items === 'object'
        && Object.hasOwn((a as Aggregate).items, 'values')
        && Object.hasOwn((a as Aggregate).items, 'order')
        && typeof (a as Aggregate).items.values === 'object'
        && Object.entries((a as Aggregate).items.values).every((k, v) => typeof k === 'string' && isAggregate(v))
        && Array.isArray((a as Aggregate).items.order)
        && (a as Aggregate).items.order.every((o: unknown) => typeof o === 'string')
      )
    )
}

/**
 * Type guard for Subset
 * @param s variable to check
 * @returns {boolean}
 */
export function isSubset(s: unknown): s is Subset {
  return isBaseIntersection(s);
}

/**
 * Type guard for BaseIntersection
 * @param i variable to check
 * @returns {boolean}
 */
export function isBaseIntersection(i: unknown): i is BaseIntersection {
  return !!i
    && isBaseElement(i)
    && Object.hasOwn(i, 'setMembership')
    && typeof (i as BaseIntersection).setMembership === 'object'
    && Object.values((i as BaseIntersection).setMembership).every(
      (v: unknown) => v === 'Yes' || v === 'No' || v === 'May'
    )
}

/**
 * Type guard for BookmarkedSelection
 * @param b variable to check
 * @returns {boolean}
 */
export function isBookmarkedSelection(b: unknown): b is BookmarkedSelection {
  return isBookmark(b)
  && b.type === 'elements'
  && Object.hasOwn(b, 'selection')
  && isElementSelection((b as BookmarkedSelection).selection);
}

/**
 * Type guard for BaseElement
 * @param r variable to check
 * @returns {boolean}
 */
export function isBaseElement(r: unknown): r is BaseElement {
  return !!r
    && typeof r === 'object'
    && Object.hasOwn(r, 'id')
    && Object.hasOwn(r, 'elementName')
    && Object.hasOwn(r, 'size')
    && Object.hasOwn(r, 'type')
    && Object.hasOwn(r, 'attributes')
    && Object.hasOwn(r, 'items')
    && typeof (r as BaseElement).id === 'string'
    && typeof (r as BaseElement).elementName === 'string'
    && typeof (r as BaseElement).size === 'number'
    && typeof (r as BaseElement).attributes === 'object'
    && ((r as BaseElement).type === 'Set' 
      || (r as BaseElement).type === 'Subset' 
      || (r as BaseElement).type === 'Group' 
      || (r as BaseElement).type === 'Aggregate' 
      || (r as BaseElement).type === 'Query Group' 
      || (r as BaseElement).type === 'Seperator' 
      || (r as BaseElement).type === 'Undefined')
    && Array.isArray((r as BaseElement).items)
    && (r as BaseElement).items.every((i: unknown) => typeof i === 'string')
}