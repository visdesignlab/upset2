import {
  getDegreeFromSetMembership,
  Intersections,
  Aggregates,
  areRowsSubsets,
  Rows,
  SortBy,
  SortVisibleBy,
  Sets,
} from './types';
import { deepCopy } from './utils';

function sortBySize(rows: Intersections) {
  const { values, order } = rows;
  const newOrder = [...order].sort((b, a) => values[a].size - values[b].size);

  return { values, order: newOrder };
}

function compareUnionSizes(a: any, b: any, visibleSets: Sets, vSetSortBy: SortVisibleBy) {
  const aUnionSize = Object.entries(a.setMembership)
    .filter(([_key, value]) => value === 'Yes')
    .map(([key, _value]) => visibleSets[key].size)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  const bUnionSize = Object.entries(b.setMembership)
    .filter(([_key, value]) => value === 'Yes')
    .map(([key, _value]) => visibleSets[key].size)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  return (vSetSortBy === 'Ascending') ? aUnionSize - bUnionSize : bUnionSize - aUnionSize;
}

function sortByDegree(rows: Intersections, vSetSortBy: SortVisibleBy, visibleSets: Sets) {
  const { values, order } = rows;
  const newOrder = [...order].sort(
    (a, b) => {
      const diff = getDegreeFromSetMembership(values[a].setMembership) -
                  getDegreeFromSetMembership(values[b].setMembership);

      if (diff !== 0) {
        return diff;
      }

      switch (vSetSortBy) {
        case 'Alphabetical':
          return values[a].elementName.localeCompare(values[b].elementName);
        case 'Ascending':
          return compareUnionSizes(values[a], values[b], visibleSets, vSetSortBy);
        case 'Descending':
          return compareUnionSizes(values[a], values[b], visibleSets, vSetSortBy);
        default:
          return 0;
      }
    },
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
  vSetSortBy: SortVisibleBy,
  visibleSets: Sets,
) {
  switch (sortBy) {
    case 'Size':
      return sortBySize(intersection);
    case 'Degree':
      return sortByDegree(intersection, vSetSortBy, visibleSets);
    case 'Deviation':
      return sortByDeviation(intersection);
    default:
      return intersection;
  }
}

export function sortRows(baseRows: Rows, sortBy: SortBy, vSetSortBy: SortVisibleBy, visibleSets: Sets): Rows {
  const rows = deepCopy(baseRows);

  if (areRowsSubsets(rows)) {
    return sortIntersections(rows, sortBy, vSetSortBy, visibleSets);
  }

  const aggs: Aggregates = sortIntersections(rows as any, sortBy, vSetSortBy, visibleSets) as any;

  aggs.order.forEach((aggId) => {
    const { items } = aggs.values[aggId];

    const newItems = sortRows(items, sortBy, vSetSortBy, visibleSets);

    aggs.values[aggId].items = newItems;
  });

  return aggs;
}
