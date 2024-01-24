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

function sortBySize(rows: Intersections, sortOrder?: string) {
  const { values, order } = rows;

  const newOrder = [...order].sort((b, a) => {
    if (sortOrder === 'Ascending') {
      return values[a].size - values[b].size;
    }
    return values[b].size - values[a].size;
  });

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

function sortByDegree(rows: Intersections, vSetSortBy: SortVisibleBy, visibleSets: Sets, sortByOrder?: string) {
  const { values, order } = rows;
  const newOrder = [...order].sort(
    (a, b) => {
      const degreeA = getDegreeFromSetMembership(values[a].setMembership);
      const degreeB = getDegreeFromSetMembership(values[b].setMembership);
      const diff = (sortByOrder === 'Ascending') ? degreeA - degreeB : degreeB - degreeA;

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
  sortByOrder?: string,
) {
  switch (sortBy) {
    case 'Size':
      return sortBySize(intersection, sortByOrder);
    case 'Degree':
      return sortByDegree(intersection, vSetSortBy, visibleSets, sortByOrder);
    case 'Deviation':
      return sortByDeviation(intersection);
    default:
      return intersection;
  }
}

export function sortRows(baseRows: Rows, sortBy: SortBy, vSetSortBy: SortVisibleBy, visibleSets: Sets, sortByOrder?: string): Rows {
  const rows = deepCopy(baseRows);

  if (areRowsSubsets(rows)) {
    return sortIntersections(rows, sortBy, vSetSortBy, visibleSets, sortByOrder);
  }

  const aggs: Aggregates = sortIntersections(rows as any, sortBy, vSetSortBy, visibleSets, sortByOrder) as any;

  aggs.order.forEach((aggId) => {
    const { items } = aggs.values[aggId];

    const newItems = sortRows(items, sortBy, vSetSortBy, visibleSets, sortByOrder);

    aggs.values[aggId].items = newItems;
  });

  return aggs;
}
