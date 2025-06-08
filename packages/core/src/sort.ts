import {
  Intersections,
  Aggregates,
  Rows,
  SortVisibleBy,
  Sets,
  SortByOrder,
  SixNumberSummary,
} from './types';
import {
  areRowsSubsets,
  getBelongingSetsFromSetMembership,
  getDegreeFromSetMembership,
} from './typeutils';
import { deepCopy } from './utils';

/**
 * Sorts the rows of intersections by size.
 *
 * @param {Intersections} rows - The intersections to be sorted.
 * @param {SortByOrder} sortOrder - The order in which to sort the rows. Defaults to ascending order.
 * @returns An object containing the sorted rows and the new order.
 */
function sortBySize(rows: Intersections, sortOrder?: SortByOrder) {
  const { values, order } = rows;

  order.sort((b, a) => {
    const valA = values[a].size;
    const valB = values[b].size;
    return sortOrder === 'Descending' ? valA - valB : valB - valA;
  });

  return { values, order };
}

/**
 * Compares the union sizes of two objects based on their set membership.
 * @param a - The first object to compare.
 * @param b - The second object to compare.
 * @param {Sets} visibleSets - The visible sets.
 * @param {SortVisibleBy} vSetSortBy - The sort order for visible sets.
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

  return vSetSortBy === 'Ascending' ? aUnionSize - bUnionSize : bUnionSize - aUnionSize;
}

/**
 * Sorts the rows of intersections based on the degree of set membership and other criteria.
 *
 * @param {Intersections} rows - The intersections to be sorted.
 * @param {SortVisibleBy} vSetSortBy - The criteria to sort the intersections by.
 * @param {Sets} visibleSets - The visible sets.
 * @param {SortByOrder} sortByOrder - The order in which to sort the intersections.
 * @returns The sorted intersections.
 */
function sortByDegree(
  rows: Intersections,
  vSetSortBy: SortVisibleBy,
  visibleSets: Sets,
  sortByOrder?: SortByOrder,
) {
  const { values, order } = rows;
  order.sort((a, b) => {
    const degreeA = getDegreeFromSetMembership(values[a].setMembership);
    const degreeB = getDegreeFromSetMembership(values[b].setMembership);
    const diff = sortByOrder === 'Ascending' ? degreeA - degreeB : degreeB - degreeA;

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
  });

  return { values, order };
}

/**
 * Sorts the rows of intersections by deviation.
 *
 * @param {Intersections} rows - The intersections object containing values and order.
 * @param {SortByOrder} sortByOrder - The sort order ('Ascending' or 'Descending'). Defaults to 'Ascending'.
 * @returns The sorted intersections object.
 */
function sortByDeviation(rows: Intersections, sortByOrder?: SortByOrder) {
  const { values, order } = rows;
  order.sort((a, b) => {
    const devA = values[a].atts.deviation;
    const devB = values[b].atts.deviation;
    return sortByOrder === 'Ascending' ? devA - devB : devB - devA;
  });

  return { values, order };
}

/**
 * Sorts the rows based on a specified set. This should move the selected set to the top of the list, and sort the rest of the rows by degree ascending.
 *
 * @param rows - The rows to be sorted.
 * @param sortBy - The set to sort by.
 * @param vSetSortBy - The sort order for visible sets.
 * @param visibleSets - The visible sets.
 * @returns The sorted rows.
 */
function sortBySet(
  rows: Intersections,
  sortBy: string,
  vSetSortBy: SortVisibleBy,
  visibleSets: Sets,
) {
  // create the subset of rows which contain sortBy in their set list
  const setMembers: Intersections = { values: {}, order: [] };

  // setMembers needs to be a filtered list of values that contain the set membership, as well as order which corresponds
  const setMemberEntries = Object.entries(rows.values).filter(([, value]) =>
    getBelongingSetsFromSetMembership(value.setMembership).includes(sortBy),
  );
  setMemberEntries.forEach(([key, value]) => {
    setMembers.values[key] = value;
    setMembers.order.push(key);
  });

  // create the subset of rows which do NOT contain sortBy in their set list
  const nonSetMembers: Intersections = { values: {}, order: [] };

  // filter the list for entries which do not have the selected set as members
  const nonSetMemberEntries = Object.entries(rows.values).filter(
    ([, value]) =>
      !getBelongingSetsFromSetMembership(value.setMembership).includes(sortBy),
  );
  nonSetMemberEntries.forEach(([key, value]) => {
    nonSetMembers.values[key] = value;
    nonSetMembers.order.push(key);
  });

  // sort each of the two by degree (Ascending)
  const sortedSetMembers = sortByDegree(setMembers, vSetSortBy, visibleSets, 'Ascending');
  const sortedNonSetMembers = sortByDegree(
    nonSetMembers,
    vSetSortBy,
    visibleSets,
    'Ascending',
  );

  // combine the two sorted row lists
  const sortedOrder = [...sortedSetMembers.order, ...sortedNonSetMembers.order];
  const sortedValues = { ...sortedSetMembers.values, ...sortedNonSetMembers.values };

  return { values: sortedValues, order: sortedOrder };
}

/**
 * @param {Intersections} rows - The intersections object containing values and order.
 * @param {string} sortBy - The attribute to sort by
 * @param {SortByOrder} sortByOrder - The sort order ('Ascending' or 'Descending'). Defaults to 'Ascending'.
 * @returns The sorted intersections object.
 */
function sortByAttribute(rows: Intersections, sortBy: string, sortByOrder?: SortByOrder) {
  const { values, order } = rows;

  order.sort((a, b) => {
    const meanA = (values[a].atts[sortBy] as SixNumberSummary).mean;
    const meanB = (values[b].atts[sortBy] as SixNumberSummary).mean;

    // If one of the values is undefined (empty subset), sort it to the bottom
    if (!meanA) {
      return 1;
    }
    if (!meanB) {
      return -1;
    }

    return sortByOrder === 'Ascending' ? meanA - meanB : meanB - meanA;
  });

  return { values, order };
}

/**
 * Sorts the intersections based on the specified criteria.
 *
 * @template T - The type of intersections.
 * @param {T} intersection - The intersections to be sorted.
 * @param {string} sortBy - The criteria to sort the intersection by.
 * @param {SortVisibleBy} vSetSortBy - The criteria to sort the visible sets by.
 * @param {Sets} visibleSets - The visible sets.
 * @param {SortByOrder} [sortByOrder] - The order in which to sort the intersection.
 * @returns {T} The sorted intersections.
 */
function sortIntersections<T extends Intersections>(
  intersections: T,
  sortBy: string,
  vSetSortBy: SortVisibleBy,
  visibleSets: Sets,
  sortByOrder?: SortByOrder,
) {
  if (sortBy.includes('Set_')) {
    return sortBySet(intersections, sortBy, vSetSortBy, visibleSets);
  }

  switch (sortBy) {
    case 'Size':
      return sortBySize(intersections, sortByOrder);
    case 'Degree':
      return sortByDegree(intersections, vSetSortBy, visibleSets, sortByOrder);
    case 'Deviation':
      return sortByDeviation(intersections, sortByOrder);
    default:
      return sortByAttribute(intersections, sortBy, sortByOrder);
  }
}

/**
 * Sorts the rows based on the specified criteria.
 *
 * @param {Rows} baseRows - The base rows to be sorted.
 * @param {string} sortBy - The sort criteria.
 * @param {SortVisibleBy} vSetSortBy - The sort criteria for visible sets.
 * @param {Sets} visibleSets - The visible sets.
 * @param {SortByOrder} sortByOrder - The sort order.
 * @returns The sorted rows.
 */
export function sortRows(
  baseRows: Rows,
  sortBy: string,
  vSetSortBy: SortVisibleBy,
  visibleSets: Sets,
  sortByOrder?: SortByOrder,
): Rows {
  const rows = deepCopy(baseRows);

  if (areRowsSubsets(rows)) {
    return sortIntersections(rows, sortBy, vSetSortBy, visibleSets, sortByOrder);
  }

  const aggs: Aggregates = sortIntersections(
    rows as any,
    sortBy,
    vSetSortBy,
    visibleSets,
    sortByOrder,
  ) as any;

  aggs.order.forEach((aggId) => {
    const { rows: items } = aggs.values[aggId];

    const newItems = sortRows(items, sortBy, vSetSortBy, visibleSets, sortByOrder);

    aggs.values[aggId].rows = newItems;
  });

  return aggs;
}
