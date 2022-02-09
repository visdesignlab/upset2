import {
  getDegreeFromSetMembership,
  Intersections,
  Aggregates,
  areRowsSubsets,
  Rows,
  SortBy,
} from './types';
import { deepCopy } from './utils';

function sortByCardinality(rows: Intersections) {
  const { values, order } = rows;
  const newOrder = [...order].sort((b, a) => values[a].size - values[b].size);

  return { values, order: newOrder };
}

function sortByDegree(rows: Intersections) {
  const { values, order } = rows;
  const newOrder = [...order].sort(
    (a, b) =>
      getDegreeFromSetMembership(values[a].setMembership) -
      getDegreeFromSetMembership(values[b].setMembership),
  );

  return { values, order: newOrder };
}

function sortByDeviation(rows: Intersections) {
  const { values, order } = rows;
  const newOrder = [...order].sort(
    (a, b) => values[a].deviation - values[b].deviation,
  );

  return { values, order: newOrder };
}

function sortIntersections<T extends Intersections>(
  intersection: T,
  sortBy: SortBy,
) {
  switch (sortBy) {
    case 'Cardinality':
      return sortByCardinality(intersection);
    case 'Degree':
      return sortByDegree(intersection);
    case 'Deviation':
      return sortByDeviation(intersection);
    default:
      return intersection;
  }
}

export function sortRows(baseRows: Rows, sortBy: SortBy): Rows {
  const rows = deepCopy(baseRows);

  if (areRowsSubsets(rows)) {
    return sortIntersections(rows, sortBy);
  }

  const aggs: Aggregates = sortIntersections(rows as any, sortBy) as any;

  aggs.order.forEach((aggId) => {
    const { items } = aggs.values[aggId];

    const newItems = sortRows(items, sortBy);

    aggs.values[aggId].items = newItems;
  });

  return aggs;
}
