import { AggregateBy, Rows, Aggregates, Subsets } from './types';

export function firstAggregation(
  subsets: Subsets,
  aggregateBy: AggregateBy,
): Rows {
  if (aggregateBy === 'None') return subsets;

  return {
    values: {},
    order: [],
  };
}

export function secondAggregation(agg: Aggregates, aggregateBy: AggregateBy) {
  if (aggregateBy === 'None') return agg;

  return {
    values: {},
    order: [],
  };
}
