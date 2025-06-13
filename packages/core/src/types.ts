/* eslint-disable no-unused-vars */ // Eslint apparently has never heard of enums...
export type ColumnName = string;

/**
 * A row in a Multinet table, as typed by the Multinet package
 */
export type MultinetTableRow = {
  _key: string;
  _id: string;
  _rev: string;
};

/**
 * A row of data imported from a Multinet table, containing both the default Multinet fields
 * and any additional fields that may be present in the table.
 */
export type TableRow = MultinetTableRow & {
  [key: string]: string | number | boolean;
};

/**
 * Base type for a column in the plot
 * @private typechecked by isColumn in typecheck.ts; changes here must be reflected there
 */
export type Column = {
  name: string;
  size: number;
};

/**
 * Textual information about the plot; included in the UpsetConfig
 * @private This is typechecked by isPlotinformation in typecheck.ts; changes here must be reflected there
 */
export type PlotInformation = {
  /** User-generated plot description */
  description: string | null;
  /** User-generated name to use for sets in the plot (ie "genres") */
  sets: string | null;
  /** User-generated name for items in the dataset (ie "movies") */
  items: string | null;
  /** User-defined plot title */
  title: string | null;
  /** User-defined plot caption (for sighted users) */
  caption: string | null;
};

/**
 * Represents a row in the UpSet plot.
 * @private typechecked by isRowType in typecheck.ts; changes here must be reflected there
 */
export type RowType =
  | 'Set'
  | 'Subset'
  | 'Group'
  | 'Aggregate'
  | 'Query Group'
  | 'Seperator'
  | 'Undefined';

/** An item in the dataset; referred to in the UI as an element */
export type Item = {
  _id: string;
  _label: string;
  atts: { [attr: string]: boolean | number | string };
};

/** A list of items with labels mapped to item objects */
export type Items = { [k: string]: Item };

/** Items filtered by some query into included and excluded groups */
export type FilteredItems = { included: Item[]; excluded: Item[] };

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

/** A list of attributes on a row; maps att names to summaries of the numerical props of the att */
export type AttributeList = Record<string, SixNumberSummary>;

/**
 * List of attributes for a subset ([attr1, attr2, deviation, degree, etc])
 */
export type Attributes = {
  /** Atts computed by Upset */
  derived: {
    /**
     * The deviation of the subset.
     */
    deviation: number;
    /**
     * The degree of the subset.
     */
    degree?: number;
  };
  /** Atts defined as table columns in the dataset */
  dataset: AttributeList;
};

/**
 * Template for a row/intersection which can be a subset or an aggregat e
 * @private typechecked by isBaseRow in typecheck.ts; changes here must be reflected there
 */
export type BaseRow = {
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
   * Optional, as aggregates do not have items.
   */
  items?: string[];
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
  atts: Attributes;
  /**
   * The parent element ID, if any.
   */
  parent?: string;
};

export type SetMembershipStatus = 'Yes' | 'No' | 'May';

export const UNINCLUDED = 'unincluded';

/**
 * Base Intersection type for subsets and aggregates.
 * @private typechecked by isBaseIntersection in typecheck.ts; changes here must be reflected there
 */
export type BaseIntersection = BaseRow & {
  setMembership: { [key: string]: SetMembershipStatus };
};

export type Sets = { [set_id: string]: BaseIntersection };

/**
 * A single subset
 * @private typechecked by isSubset in typecheck.ts; changes here must be reflected there
 */
export type Subset = BaseIntersection;

/**
 * A list of subsets & their order
 * @private typechecked by isSubsets in typecheck.ts; changes here must be reflected there
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
 * @private typechecked by isAggregateBy in typecheck.ts; changes here must be reflected there
 */
export type AggregateBy = (typeof aggregateByList)[number];

export type SortByOrder = 'Ascending' | 'Descending';

export const sortVisibleByList = ['Alphabetical', 'Ascending', 'Descending'] as const;
export type SortVisibleBy = (typeof sortVisibleByList)[number];

/**
 * An aggregate row in the plot
 * @private typechecked by isAggregate in typecheck.ts; changes here must be reflected there
 */
export type Aggregate = Omit<Subset, 'items'> & {
  aggregateBy: AggregateBy;
  level: number;
  description: string;
  rows:
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
 * @private typechecked by isRow in typecheck.ts; changes here must be reflected there
 */
export type Row = Subset | Aggregate;

/**
 * Possible column types.
 * @private Taken from the TableTypeAnnotation in multinet-api
 */
export type ColumnType =
  | 'primary key'
  | 'edge source'
  | 'edge target'
  | 'label'
  | 'string'
  | 'boolean'
  | 'category'
  | 'number'
  | 'date'
  | 'ignored';

/**
 * Maps column names to their string type
 */
export type ColumnTypes = {
  [name: string]: ColumnType;
};

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
 * @private Typechecked by isScatterplot in typecheck.ts; changes here must be reflected there.
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
 * @private Typechecked by isHistogram in typecheck.ts; changes here must be reflected there
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
// linter is saying this is already declared... on this line

export enum AttributePlotType {
  BoxPlot = 'Box Plot',
  DotPlot = 'Dot Plot',
  StripPlot = 'Strip Plot',
  DensityPlot = 'Density Plot',
}

/**
 * Represents the different types of attribute plots.
 * Enum values (AttributePlotType) behave better in a Record object than in traditional dict types.
 * @private typechecked by isAttributePlots in typecheck.ts; changes here must be reflected there
 */
export type AttributePlots = Record<string, `${AttributePlotType}`>;

/**
 * Possible string types for an element query
 */
// linter is saying this is already declared... on this line

export enum ElementQueryType {
  EQUALS = 'equals',
  CONTAINS = 'contains',
  LENGTH = 'length equals',
  REGEX = 'regex',
  LESS_THAN = 'less than',
  GREATER_THAN = 'greater than',
}

/**
 * Possible string types for an element query on a numerical attribute
 */
// linter is saying this is already declared... on this line

export enum NumericalQueryType {
  EQUALS = 'equals',
  LESS_THAN = 'less than',
  GREATER_THAN = 'greater than',
}

/**
 * Represents a selection of elements based on a comparison between an attribute and a query string.
 * @private Typechecked by isQuerySelection in typecheck.ts; changes here must be reflected there
 */
export type QuerySelection = {
  /**
   * Name of the attribute being queried upon
   */
  att: string;
  /**
   * Type of the query; determines the mechanism used to evaluate whether the value of att
   * on a given element matches this query
   */
  type: ElementQueryType;
  /**
   * The query string. To be included in this query, the value of att on a given
   * element must match this query string according to the rules set by the type.
   */
  query: string;
};

/**
 * Represents a selection of elements based on their numerical attributes,
 * currently only from brushes in the element view.
 * Maps attribute names to an array with the minimum and maximum
 * values of the selection over each attribute.
 *
 * @private
 * This *needs* to match the data format outputted by Vega-Lite to the 'brush' signal in
 * upset/src/components/ElementView/ElementVisualization.tsx.
 * This is typechecked by isVegaSelection in typecheck.ts; changes here must be reflected there.
 */
export type VegaSelection = { [attName: string]: [number, number] };

/**
 * Represents the type of selection currently active in the element view.
 * This can be a row selection, a Vega selection (from plots), or a query selection.
 */
export type SelectionType = 'row' | 'vega' | 'query' | null;

/**
 * Represents a query object where each key is a string and the value is a SetMembershipStatus.
 * This type is used to define the membership status of elements in a set.
 */
export type SetQueryMembership = { [key: string]: SetMembershipStatus };

/**
 * Represents a query for a set.
 */
export type SetQuery = {
  name: string;
  query: SetQueryMembership;
};

/**
 * A bookmarked intersection
 * @private typechecked by isBookmark in typecheck.ts; changes here must be reflected there
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
   * The size of the bookmarked selection
   */
  size: number;
  /**
   * The index of this bookmark's color in the color palette.
   * Specific colors in the palette are decided by the implementation, however,
   * we store the index here so that bookmark colors are consistent across sessions.
   * Note that this is not guaranteed to be within the bounds of the color palette,
   * so implementations should be careful to handle this case.
   */
  colorIndex: number;
};

/**
 * Represents the alternative text for an Upset plot.
 * @private typechecked by isAltText in typecheck.ts; changes here must be reflected there
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
};

/**
 * A configuration object for an UpSet plot.
 * @version 0.1.0
 * @private
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
  /**
   * The selected row in the plot
   */
  rowSelection: Row | null;
  /**
   * Selected elements (data points) from Vega plots in the element view
   */
  vegaSelection: VegaSelection | null;
  /**
   * Selected elements from the query interface in the element view
   */
  querySelection: QuerySelection | null;
  /**
   * Which of the 3 selection methods is currently active in the element view
   * (values are stored in rowSelection, vegaSelection, and querySelection above)
   */
  selectionType: 'row' | 'vega' | 'query' | null;
  version: '0.1.5';
  userAltText: AltText | null;
  /**
   * Whether to display numerical size labels on the intersection size bars.
   */
  intersectionSizeLabels: boolean;
  /**
   * Whether to display numerical size labels on the set size bars.
   */
  setSizeLabels: boolean;
  /**
   * Whether to display the hidden sets & their sizes above the plot
   */
  showHiddenSets: boolean;
  /**
   * Query by set query
   */
  setQuery: SetQuery | null;
};

export type AccessibleDataEntry = {
  elementName: string;
  type: RowType;
  size: number;
  /**
   * Attributes of the data entry.
   * @private Currently needs to be flat and named 'Attributes' to be compatible with the Upset text generator
   */
  attributes: Record<string, SixNumberSummary | number>;
  degree: number;
  id?: string;
  setMembership?: {
    [set: string]: SetMembershipStatus;
  };
  /** If this is an aggregate row, represents sub-rows */
  rows?: {
    [row: string]: AccessibleDataEntry;
  };
};

export type AccessibleData = {
  values: {
    [row: string]: AccessibleDataEntry;
  };
};

export type AltTextConfig = UpsetConfig & {
  rawData?: CoreUpsetData;
  processedData?: AccessibleData;
  accessibleProcessedData?: AccessibleData;
};

export type JSONExport = UpsetConfig & {
  rawData?: CoreUpsetData;
  processedData?: Rows;
  accessibleProcessedData?: AccessibleData;
};
