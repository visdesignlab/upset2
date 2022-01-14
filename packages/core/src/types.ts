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

export type ItemId = string;

export type Item = {
  _id: ItemId;
  _label: string;
  [attr: string]: boolean | number | string;
};

export type BaseElement = {
  id: string;
  elementName: string;
  items: ItemId[];
  type: RowType;
  size: number;
};

export type SetMembershipStatus = 'Yes' | 'No' | 'May';

export type ISet = BaseElement & {
  setMembership: { [key: string]: SetMembershipStatus };
};
export type Sets = { [set_id: string]: ISet };

type BaseIntersection = {
  deviation: number;
};

export type Subset = ISet & BaseIntersection;
export type Subsets = { [subset_id: string]: Subset };

export type AggregateBy =
  | 'Degree'
  | 'Sets'
  | 'Deviations'
  | 'Overlaps'
  | 'None';

export type Aggregate = Subset & {
  type: AggregateBy;
  level: number;
};
export type Aggregates = { [agg_id: string]: Aggregate };

export type CoreUpsetData = {
  label: ColumnName;
  setColumns: ColumnName[];
  columns: ColumnName[];
  items: { [key: string]: Item };
  sets: { [id: string]: ISet };
};
