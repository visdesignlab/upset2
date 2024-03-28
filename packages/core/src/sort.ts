import {
  getDegreeFromSetMembership,
  Intersections,
  Aggregates,
  areRowsSubsets,
  Rows,
  SortBy,
  SortVisibleBy,
  Sets,
  SortByOrder,
} from './types';
import { deepCopy } from './utils';

/**
 * Sorts the rows of intersections by size.
 *
 * @param rows - The intersections to be sorted.
 * @param sortOrder - The order in which to sort the rows. Defaults to ascending order.
 * @returns An object containing the sorted rows and the new order.
 */
function sortBySize(rows: Intersections, sortOrder?: string) {
  const { values, order } = rows;

  const newOrder = [...order].sort((b, a) => {
    const valA = values[a].size;
    const valB = values[b].size;
    return (sortOrder === 'Descending') ? valA - valB : valB - valA;
  });

  return { values, order: newOrder };
}

/**
 * Compares the union sizes of two objects based on their set membership.
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @param visibleSets - The visible sets.
 * @param vSetSortBy - The sort order for visible sets.
 * @returns A number indicating the comparison result.
 */
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

/**
 * Sorts the rows of intersections based on the degree of set membership and other criteria.
 *
 * @param rows - The intersections to be sorted.
 * @param vSetSortBy - The criteria to sort the intersections by.
 * @param visibleSets - The visible sets.
 * @param sortByOrder - The order in which to sort the intersections.
 * @returns The sorted intersections.
 */
function sortByDegree(rows: Intersections, vSetSortBy: SortVisibleBy, visibleSets: Sets, sortByOrder?: SortByOrder) {
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

/**
 * Sorts the rows of intersections by deviation.
 *
 * @param rows - The intersections object containing values and order.
 * @param sortByOrder - The sort order ('Ascending' or 'Descending'). Defaults to 'Ascending'.
 * @returns The sorted intersections object.
 */
function sortByDeviation(rows: Intersections, sortByOrder?: SortByOrder) {
  const { values, order } = rows;
  const newOrder = [...order].sort(
    (a, b) => {
      const devA = values[a].attributes.deviation;
      const devB = values[b].attributes.deviation;
      return (sortByOrder === 'Ascending') ? devA - devB : devB - devA;
    },
  );

  return { values, order: newOrder };
}

/**
 * Sorts the intersections based on the specified criteria.
 *
 * @template T - The type of intersections.
 * @param {T} intersection - The intersection to be sorted.
 * @param {SortBy} sortBy - The criteria to sort the intersection by.
 * @param {SortVisibleBy} vSetSortBy - The criteria to sort the visible sets by.
 * @param {Sets} visibleSets - The visible sets.
 * @param {SortByOrder} [sortByOrder] - The order in which to sort the intersection.
 * @returns {T} The sorted intersection.
 */
function sortIntersections<T extends Intersections>(
  intersection: T,
  sortBy: SortBy,
  vSetSortBy: SortVisibleBy,
  visibleSets: Sets,
  sortByOrder?: SortByOrder,
) {
  switch (sortBy) {
    case 'Size':
      return sortBySize(intersection, sortByOrder);
    case 'Degree':
      return sortByDegree(intersection, vSetSortBy, visibleSets, sortByOrder);
    case 'Deviation':
      return sortByDeviation(intersection, sortByOrder);
    default:
      return intersection;
  }
}

/**
 * Sorts the rows based on the specified criteria.
 *
 * @param baseRows - The base rows to be sorted.
 * @param sortBy - The sort criteria.
 * @param vSetSortBy - The sort criteria for visible sets.
 * @param visibleSets - The visible sets.
 * @param sortByOrder - The sort order.
 * @returns The sorted rows.
 */
export function sortRows(baseRows: Rows, sortBy: SortBy, vSetSortBy: SortVisibleBy, visibleSets: Sets, sortByOrder?: SortByOrder): Rows {
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
