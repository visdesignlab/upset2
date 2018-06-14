export class RenderConfig {
  firstLevelAggregateBy: AggregateBy = AggregateBy.DEGREE;
  secondLevelAggregateBy: AggregateBy = AggregateBy.NONE;
  sortBy: SortBy = SortBy.CARDINALITY;
  collapseAll: boolean = false;
  hideEmptyIntersection: boolean = true;
  minDegree: number = 0;
  maxDegree: number = 3;
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
  DEVIATION = "DEVIATION"
}
