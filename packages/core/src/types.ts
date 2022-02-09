export type ColumnName = string;

export type ColumnDefs = {
  [columnName: string]: 'number' | 'boolean' | 'string' | 'label';
};

export type Meta = {
  name: string;
  author?: string;
  description?: string;
  source?: string;
  columns: ColumnDefs;
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

export type BaseElement = {
  id: string;
  elementName: string;
  items: string[];
  type: RowType;
  size: number;
};

export type SetMembershipStatus = 'Yes' | 'No' | 'May';

export type ISet = BaseElement & {
  setMembership: { [key: string]: SetMembershipStatus };
};

export const UNINCLUDED = 'unincluded';

export type Sets = { [set_id: string]: ISet };

type BaseIntersection = ISet & {
  deviation: number;
};

export type Subset = BaseIntersection;

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
export type AggregateBy = typeof aggregateByList[number];

export const sortByList = ['Degree', 'Cardinality', 'Deviation'] as const;
export type SortBy = typeof sortByList[number];

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

export type Row = Subset | Aggregate;

export type CoreUpsetData = {
  label: ColumnName;
  setColumns: ColumnName[];
  columns: ColumnName[];
  items: Items;
  sets: Sets;
};

export type UpsetConfig = {
  firstAggregateBy: AggregateBy;
  firstOverlapDegree: number;
  secondAggregateBy: AggregateBy;
  secondOverlapDegree: number;
  sortBy: SortBy;
  filters: {
    maxVisible: number;
    minVisible: number;
    hideEmpty: boolean;
  };
};

export function areRowsAggregates(rr: Rows): rr is Aggregates {
  const { order } = rr;

  if (order.length === 0) return false;

  const row = rr.values[order[0]];

  return row.type === 'Aggregate';
}

export function areRowsSubsets(rr: Rows): rr is Subsets {
  const { order } = rr;

  if (order.length === 0) return false;

  const row = rr.values[order[0]];

  return row.type === 'Subset';
}

export function isRowAggregate(row: Row): row is Aggregate {
  return row.type === 'Aggregate';
}

export function isRowSubset(row: Row): row is Subset {
  return row.type === 'Subset';
}

export function getDegreeFromSetMembership(membership: {
  [key: string]: SetMembershipStatus;
}): number {
  if (Object.values(membership).length === 0) return -1;
  return Object.values(membership).filter((m) => m === 'Yes').length;
}

export function getBelongingSetsFromSetMembership(membership: {
  [key: string]: SetMembershipStatus;
}): string[] {
  return Object.entries(membership)
    .filter((mem) => mem[1] === 'Yes')
    .map((mem) => mem[0]);
}
