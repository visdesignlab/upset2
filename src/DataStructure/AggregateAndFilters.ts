import { IDataSetInfo } from "./IDataSetInfo";
export class RenderConfig {
  firstLevelAggregateBy: AggregateBy = AggregateBy.NONE;
  firstOverlap: number = 2;
  secondLevelAggregateBy: AggregateBy = AggregateBy.NONE;
  secondOverlap: number = 2;
  sortBy: SortBy = SortBy.CARDINALITY;
  collapseAll: boolean = false;
  hideEmptyIntersection: boolean = true;
  minDegree: number = 0;
  maxDegree: number = 3;
  currentFile: IDataSetInfo;
}

export enum AggregateBy {
  DEGREE = "DEGREE",
  SETS = "SETS",
  DEVIATION = "DEVIATION",
  OVERLAPS = "OVERLAPS",
  NONE = "NONE"
}

export enum SortBy {
  DEGREE = "DEGREE",
  CARDINALITY = "CARDINALITY",
  DEVIATION = "DEVIATION",
  SET = "SET"
}
