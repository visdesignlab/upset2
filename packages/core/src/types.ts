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
 * @privateRemarks This is typechecked by isPlotinformation in typecheck.ts; changes here must be reflected there
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
 * @privateRemarks typechecked by isRowType in typecheck.ts; changes here must be reflected there
 */
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

/** Items filtered by some query into included and excluded groups */
export type FilteredItems = {included: Item[], excluded: Item[]};

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
 * List of attributes for a subset ([attr1, attr2, deviation, degree, etc])
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

/**
 * Possible column types.
 * @private Taken from the TableTypeAnnotation in multinet-api
 */
export type ColumnType = 'primary key' | 'edge source' | 'edge target' | 'label' | 'string' | 'boolean' | 'category' | 'number' | 'date' | 'ignored';

/**
 * Maps column names to their string type
 */
export type ColumnTypes = {
    [key: string]: ColumnType;
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
// linter is saying this is already declared... on this line
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
 * @privateRemarks typechecked by isAttributePlots in typecheck.ts; changes here must be reflected there
 */
export type AttributePlots = Record<string, `${AttributePlotType}`>;

/**
 * Possible string types for an element query
 */
// linter is saying this is already declared... on this line
// eslint-disable-next-line no-shadow
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
// eslint-disable-next-line no-shadow
export enum NumericalQueryType {
  EQUALS = 'equals',
  LESS_THAN = 'less than',
  GREATER_THAN = 'greater than',
}

/**
 * Represents a selection of elements based on a comparison between an attribute and a query string.
 */
export type AttQuery = {
  /**
   * Name of the attribute being queried upon
   */
  att: string,
  /**
   * Type of the query; determines the mechanism used to evaluate whether the value of att
   * on a given element matches this query
   */
  type: ElementQueryType,
  /**
   * The query string. To be included in this query, the value of att on a given
   * element must match this query string according to the rules set by the type.
   */
  query: string,
}

/**
 * Represents a selection of elements based on their numerical attributes,
 * currently only from brushes in the element view.
 * Maps attribute names to an array with the minimum and maximum
 * values of the selection over each attribute.
 *
 * @privateRemarks
 * This *needs* to match the data format outputted by Vega-Lite to the 'brush' signal in
 * upset/src/components/ElementView/ElementVisualization.tsx.
 * This is typechecked by isNumericalQuery in typecheck.ts; changes here must be reflected there.
 */
export type NumericalQuery = {[attName: string] : [number, number]};

/**
 * Wrapper type for an element query
 */
export type AttSelection = {
  type: 'element';
  query: AttQuery;
  active: boolean;
}

/**
 * Wrapper type for a numerical query
 */
export type NumericalSelection = {
  type: 'numerical';
  query: NumericalQuery;
  active: boolean;
}

/**
 * Represents a selection of elements.
 * Can be either an element query or a numerical query.
 * Active is true if the selection is currently being applied to the plot;
 * an inactive selection shows as a deselected chip in the element view.
 */
export type ElementSelection = AttSelection | NumericalSelection;

/**
 * Represents a query object where each key is a string and the value is a SetMembershipStatus.
 * This type is used to define the membership status of elements in a set.
 */
export type SetQueryMembership = {[key: string]: SetMembershipStatus};

/**
 * Represents a query for a set.
 */
export type SetQuery = {
  name: string;
  query: SetQueryMembership;
}

/**
 * A bookmarked intersection
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
   * The size of the bookmarked selection
   */
  size: number;
};

/**
 * Represents the alternative text for an Upset plot.
 * @privateRemarks typechecked by isAltText in typecheck.ts; changes here must be reflected there
*/
export type AltText = {
  /**
  * The long description for the Upset plot.
  */
  longDescription: string | null;

  /**
  * The short description for the Upset plot.
  */
  shortDescription: string | null;

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
  elementSelection: ElementSelection | null;
  version: '0.1.3';
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
