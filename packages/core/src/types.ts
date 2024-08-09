import { hashString } from './utils';

export type ColumnName = string;

/**
 * Base type for a column in the plot
 * @privateRemarks typechecked by isColumn in typecheck.ts; changes here must be reflected there
 */
export type Column = {
  name: string;
  size: number;
};

export type ColumnDefs = {
  [columnName: string]: 'number' | 'boolean' | 'string' | 'label';
};

export type Meta = {
  columns: ColumnDefs;
};

/**
 * Textual information about the plot; included in the UpsetConfig
 * @privateRemarks This is typechecked in isUpsetConfig; changes here must be reflected there
 */
export type PlotInformation = {
  /** User-generated plot description */
  description?: string;
  /** User-generated name to use for sets in the plot (ie "genres") */
  sets?: string;
  /** User-generated name for items in the dataset (ie "movies") */
  items?: string;
  /** User-defined plot title */
  title?: string;
  /** User-defined plot caption (for sighted users) */
  caption?: string;
};

export type RowType =
  | 'Set'
  | 'Subset'
  | 'Group'
  | 'Aggregate'
  | 'Query Group'
  | 'Seperator'
  | 'Undefined';

export type Item = {
  _id: string;
  _label: string;
  [attr: string]: boolean | number | string;
};

export type Items = { [k: string]: Item };

/**
 * Represents a six-number summary. Derived for the Boxplot
 */
export type SixNumberSummary = {
  /**
   * The minimum value.
   */
  min?: number;
  /**
   * The maximum value.
   */
  max?: number;
  /**
   * The median value.
   */
  median?: number;
  /**
   * The mean value.
   */
  mean?: number;
  /**
   * The first quartile value.
   */
  first?: number;
  /**
   * The third quartile value.
   */
  third?: number;
};

/**
 * Represents a list of attributes and their corresponding values.
 * The keys are attribute names and the values can be either a `SixNumberSummary` object or a number (deviation).
 */
export type AttributeList = {
  [attribute: string]: SixNumberSummary | number;
}

/**
 * List of attributes for a subset ({attr1, attr2, deviation, degree, etc})
 */
export type Attributes = AttributeList & {
  /**
   * The deviation of the subset.
   */
  deviation: number;
  /**
   * The degree of the subset.
   */
  degree?: number;
};

/**
 * Represents a base element.
 * @privateRemarks typechecked by isBaseElement in typecheck.ts; changes here must be reflected there
 */
export type BaseElement = {
  /**
   * The ID of the element.
   */
  id: string;
  /**
   * The name of the element.
   */
  elementName: string;
  /**
   * The items associated with the element.
   */
  items: string[];
  /**
   * The type of the element.
   */
  type: RowType;
  /**
   * The size of the element.
   */
  size: number;
  /**
   * The attributes of the element.
   */
  attributes: Attributes;
  /**
   * The parent element ID, if any.
   */
  parent?: string;
};

export type SetMembershipStatus = 'Yes' | 'No' | 'May';

export const UNINCLUDED = 'unincluded';

/**
 * Base Intersection type for subsets and aggregates.
 * @privateRemarks typechecked by isBaseIntersection in typecheck.ts; changes here must be reflected there
 */
export type BaseIntersection = BaseElement & {
  setMembership: { [key: string]: SetMembershipStatus };
};

export type Sets = { [set_id: string]: BaseIntersection };

/**
 * A single subset
 * @privateRemarks typechecked by isSubset in typecheck.ts; changes here must be reflected there
 */
export type Subset = BaseIntersection;

/**
 * A list of subsets & their order
 * @privateRemarks typechecked by isSubsets in typecheck.ts; changes here must be reflected there
 */
export type Subsets = {
  values: { [subset_id: string]: Subset };
  order: string[];
};

export type Intersections = {
  values: { [k: string]: BaseIntersection };
  order: string[];
};

export const aggregateByList = [
  'Degree',
  'Sets',
  'Deviations',
  'Overlaps',
  'None',
] as const;

/**
 * Ways the upset plot can be aggregated
 * @privateRemarks typechecked by isAggregateBy in typecheck.ts; changes here must be reflected there
 */
export type AggregateBy = typeof aggregateByList[number];

export type SortByOrder = 'Ascending' | 'Descending';

export const sortVisibleByList = ['Alphabetical', 'Ascending', 'Descending'] as const;
export type SortVisibleBy = typeof sortVisibleByList[number];

/**
 * An aggregate row in the plot
 * @privateRemarks typechecked by isAggregate in typecheck.ts; changes here must be reflected there
 */
export type Aggregate = Omit<Subset, 'items'> & {
  aggregateBy: AggregateBy;
  level: number;
  description: string;
  items:
    | Subsets
    | {
        values: { [agg_id: string]: Aggregate };
        order: string[];
      };
};

export type Aggregates = {
  values: { [agg_id: string]: Aggregate };
  order: string[];
};

export type Rows = Subsets | Aggregates;

/**
 * A row in the plot
 * @privateRemarks typechecked by isRow in typecheck.ts; changes here must be reflected there
 */
export type Row = Subset | Aggregate;

export type ColumnTypes = {
    [key: string]: string;
}

export type CoreUpsetData = {
  label: ColumnName;
  setColumns: ColumnName[];
  attributeColumns: ColumnName[];
  columns: ColumnName[];
  columnTypes: ColumnTypes;
  items: Items;
  sets: Sets;
};

export type BasePlot = {
  id: string;
};

/**
 * Information defining an element view scatterplot
 * @privateRemarks Typechecked by isScatterplot in typecheck.ts; changes here must be reflected there.
 */
export type Scatterplot = BasePlot & {
  type: 'Scatterplot';
  x: string;
  y: string;
  xScaleLog?: boolean;
  yScaleLog?: boolean;
};

/**
 * Information defining an element view histogram.
 * @privateRemarks Typechecked by isHistogram in typecheck.ts; changes here must be reflected there
 */
export type Histogram = BasePlot & {
  type: 'Histogram';
  attribute: string;
  bins: number;
  frequency: boolean;
};

export type Plot = Scatterplot | Histogram;

/**
 * Represents the different types of attribute plots.
 * Enum value is used here so that the values can be used as keys in upset package.
*/
// linter is saying this is already declared on line 226 (the line it is first declared...)
// eslint-disable-next-line no-shadow
export enum AttributePlotType {
  BoxPlot = 'Box Plot',
  DotPlot = 'Dot Plot',
  StripPlot = 'Strip Plot',
  DensityPlot = 'Density Plot',
}

/**
 * Represents the different types of attribute plots.
 * Enum values (AttributePlotType) behave better in a Record object than in traditional dict types.
 */
export type AttributePlots = Record<string, `${AttributePlotType}`>;

/**
 * Base representation of a bookmarkable type
 * @privateRemarks typechecked by isBookmark in typecheck.ts; changes here must be reflected there
 */
export type Bookmark = {
  /**
   * The unique ID of the bookmark.
   */
  id: string;
  /**
   * The display name of the bookmark.
   */
  label: string;
  /**
   * Subtype of the bookmark; used to determine what fields are available at runtime
   */
  type: 'intersection' | 'elements';
};

/**
 * A bookmarked intersection.
 */
export type BookmarkedIntersection = Bookmark & {
  /**
   * The size of the bookmarked intersection.
   */
  size: number;
  /**
   * Indicates type at runtime
   */
  type: 'intersection';
}

/**
 * Represents a selection of elements in the Element View.
 * Maps attribute names to an array with the minimum and maximum
 * values of the selection over each attribute.
 *
 * @privateRemarks
 * This *needs* to match the data format outputted by Vega-Lite to the 'brush' signal in the Element View.
 * This is typechecked by isElementSelection in typecheck.ts; changes here must be reflected there.
 */
export type ElementSelection = {[attName: string] : [number, number]};

/**
 * Represents a bookmarked element selection, created in the Element View.
 * @privateRemarks typechecked by isBookmarkedSelection in typecheck.ts; changes here must be reflected there
 */
export type BookmarkedSelection = Bookmark & {
  /**
   * The selection parameters
   */
  selection: ElementSelection;
  /**
   * Indicates type at runtime
   */
  type: 'elements';
}

/**
 * Represents the alternative text for an Upset plot.
 * @privateRemarks typechecked by isAltText in typecheck.ts; changes here must be reflected there
*/
export type AltText = {
  /**
  * The long description for the Upset plot.
  */
  longDescription: string;

  /**
  * The short description for the Upset plot.
  */
  shortDescription: string;

  /**
  * The technique description for the Upset plot.
  */
  techniqueDescription?: string;

  /**
  * Optional warnings for the Upset plot.
  * Not yet implemented by the API as of 4/22/24
  */
  warnings?: string;
}

/**
 * A configuration object for an UpSet plot.
 * @version 0.1.0
 * @privateRemarks
 * Each breaking update to this config MUST be accompanied by an update to the config converter
 * in `convertConfig.ts`. Full instructions are provided in the converter file.
 * ANY update to this config must be accompanied by a change to the isUpsetConfig function in typecheck.ts
 */
export type UpsetConfig = {
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
  /**
   * Bookmarked selections, can be intersections or element selections.
   */
  bookmarks: Bookmark[];
  collapsed: string[];
  plots: {
    scatterplots: Scatterplot[];
    histograms: Histogram[];
  };
  allSets: Column[];
  selected: Row | null;
  /**
   * Selected elements (data points) in the Element View.
   */
  elementSelection: BookmarkedSelection | null;
  version: '0.1.0';
  useUserAlt: boolean;
  userAltText: AltText | null;
};

export type AccessibleDataEntry = {
  elementName: string;
  type: RowType;
  size: number;
  attributes: Attributes;
  degree: number;
  id?: string;
  setMembership?: {
      [set: string]: SetMembershipStatus;
  };
  items?: {
      [row: string]: AccessibleDataEntry;
  };
}

export type AccessibleData = {
  values: {
      [row: string]: AccessibleDataEntry;
  };
}

export type AltTextConfig = UpsetConfig & {
  rawData?: CoreUpsetData;
  processedData?: Rows;
  accessibleProcessedData?: AccessibleData
};

/**
 * Checks if the given rows are aggregates.
 * @param rr The rows to check.
 * @returns `true` if the rows are aggregates, `false` otherwise.
 */
export function areRowsAggregates(rr: Rows): rr is Aggregates {
  const { order } = rr;

  if (order.length === 0) return false;

  const row = rr.values[order[0]];

  return row.type === 'Aggregate';
}

/**
 * Checks if the given rows are subsets.
 * @param rr - The rows to check.
 * @returns True if the rows are subsets, false otherwise.
 */
export function areRowsSubsets(rr: Rows): rr is Subsets {
  const { order } = rr;

  if (order.length === 0) return false;

  const row = rr.values[order[0]];

  return row.type === 'Subset';
}

/**
 * Checks if a given row is an aggregate.
 * @param row - The row to check.
 * @returns True if the row is an aggregate, false otherwise.
 */
export function isRowAggregate(row: Row): row is Aggregate {
  return row.type === 'Aggregate';
}

/**
 * Checks if a given row is a subset.
 * @param row - The row to check.
 * @returns True if the row is a subset, false otherwise.
 */
export function isRowSubset(row: Row): row is Subset {
  return row.type === 'Subset';
}

/**
 * Checks if a bookmark is a BookmarkedIntersection.
 * @param b - The bookmark to check.
 * @returns True if the bookmark is a BookmarkedIntersection, false otherwise.
 */
export function isBookmarkedIntersection(b: Bookmark): b is BookmarkedIntersection {
  return b.type === 'intersection';
}

/**
 * Checks if two element selections are equal
 * {} is considered == to undefined
 * @param a The first element selection
 * @param b The second element selection
 * @param {number} decimalPlaces The number of decimal places to use when comparing equality of numbers, default 4
 * @returns Whether a and b are equal
 */
export function elementSelectionsEqual(a: ElementSelection | undefined, b: ElementSelection | undefined, decimalPlaces = 4): boolean {
  // We want undefined == {}
  if (!a || Object.keys(a).length === 0) {
    return (!b || Object.keys(b).length === 0);
  }
  if (!a || !b) return false;

  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;

  const round = 10 ** decimalPlaces;
  function prep(num: number): number {
    return Math.round(num * round);
  }

  return keys.every(
    (key) => Object.hasOwn(b, key)
      && prep(a[key][0]) === prep(b[key][0])
      && prep(a[key][1]) === prep(b[key][1]),
  );
}

/**
 * Converts an element selection to a bookmark.
 * Generates the ID by hashing the selection and
 * labels the bookmark with the selection attributes.
 * @param selection The numerical attribute query.
 * @returns The element selection.
 */
export function elementSelectionToBookmark(selection: ElementSelection): BookmarkedSelection {
  // Normalizing prevents floating point error from causing different hashes
  const norm = (i : number) => Math.abs(Math.round(i * 10000));

  let i = 1;
  Object.entries(selection).forEach(([key, value]) => {
    i *= norm(hashString(key)) * norm(value[0]) * norm(value[1]);
  });
  i = norm(i);
  return {
    id: i.toString(),
    label: `Atts: ${Object.keys(selection).join(', ')}`,
    type: 'elements',
    selection,
  };
}

/**
 * Calculates the degree of set membership based on the provided membership object.
 * The degree of set membership is the number of sets in which the subset is comprised of.
 *
 * @param membership - The membership object containing the set membership statuses.
 * @returns The degree of set membership.
 */
export function getDegreeFromSetMembership(membership: {
  [key: string]: SetMembershipStatus;
}): number {
  if (Object.values(membership).length === 0) return -1;
  return Object.values(membership).filter((m) => m === 'Yes').length;
}

/**
 * Retrieves the belonging sets from a set membership object.
 * @param membership - The set membership object.
 * @returns An array of strings representing the belonging sets.
 */
export function getBelongingSetsFromSetMembership(membership: {
  [key: string]: SetMembershipStatus;
}): string[] {
  return Object.entries(membership)
    .filter((mem) => mem[1] === 'Yes')
    .map((mem) => mem[0]);
}
