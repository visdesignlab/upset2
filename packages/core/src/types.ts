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
  size?: number;
  dataRatio?: number;
  disproportionality?: number;
};

export type ISet = BaseElement & {
  setMembership: string;
  setMembershipCount: number;
};

export type Subset = ISet & {
  expectedProbability?: number;
};

export type CoreUpsetData = {
  label: ColumnName;
  setColumns: ColumnName[];
  columns: ColumnName[];
  items: { [key: string]: Item };
  sets: { [id: string]: ISet };
};
