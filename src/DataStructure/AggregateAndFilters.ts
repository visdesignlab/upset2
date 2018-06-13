export class RenderConfig {
  firstLevelAggregateBy: AggregateBy = AggregateBy.DEGREE;
  secondLevelAggregateBy: AggregateBy = AggregateBy.NONE;
  sortBy: SortBy = SortBy.DEGREE;
  collapseAll: boolean = false;
  hideEmptyIntersection: boolean = true;
  minDegree: number = 0;
  maxDegree: number = 3;
}

export enum AggregateBy {
  DEGREE,
  SETS,
  DEVIATION,
  OVERLAPS,
  NONE
}

export enum SortBy {
  DEGREE,
  CARDINALITY,
  DEVIATION
}
