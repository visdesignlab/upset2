import { getAggSize } from './aggregate';
import { Intersections, Rows } from './types';
import {
  areRowsAggregates,
  areRowsSubsets,
  getDegreeFromSetMembership,
  isRowAggregate,
} from './typeutils';
import { deepCopy } from './utils';

/**
 * Filters the intersections based on the provided criteria.
 *
 * @template T - The type of the intersections.
 * @param {T} rows - The intersections to filter.
 * @param {Object} filters - The filter criteria.
 * @param {number} filters.maxVisible - The maximum visible degree.
 * @param {number} filters.minVisible - The minimum visible degree.
 * @param {boolean} filters.hideEmpty - Whether to hide empty subsets.
 * @param {boolean} filters.hideNoSet - Whether to hide subsets with no set membership.
 * @returns {Object} - The filtered intersections.
 */
function filterIntersections<T extends Intersections>(
  rows: T,
  filters: {
    maxVisible: number;
    minVisible: number;
    hideEmpty: boolean;
    hideNoSet: boolean;
  },
) {
  const { values, order } = rows;

  const newOrder = order.filter((id) => {
    const subset = values[id];
    const degree = getDegreeFromSetMembership(subset.setMembership);

    // determine if the subset is within the filter range and meets the hide conditions
    if (
      (degree >= filters.minVisible && degree <= filters.maxVisible) ||
      subset.type === 'Aggregate'
    ) {
      if (degree === 0 && filters.hideNoSet) {
        return false;
      }

      if (subset.size === 0 && filters.hideEmpty) {
        return false;
      }

      return true;
    }

    return false;
  });

  const newValues: typeof values = {};

  newOrder.forEach((id) => {
    newValues[id] = values[id];
  });

  return { values: newValues, order: newOrder };
}

/**
 * Filters the rows based on the provided filters.
 * @param baseRows The base rows to filter.
 * @param filters The filters to apply.
 * @returns The filtered rows.
 */
export function filterRows(
  baseRows: Rows,
  filters: {
    maxVisible: number;
    minVisible: number;
    hideEmpty: boolean;
    hideNoSet: boolean;
  },
): Rows {
  const rows = deepCopy(baseRows);

  if (areRowsSubsets(rows)) {
    return filterIntersections(rows, filters);
  } else if (!areRowsAggregates(rows, true))
    console.error('Type error: Rows are not subsets or aggregates: ', rows);

  const filtered = filterIntersections(rows, filters);

  filtered.order.forEach((rowOrder) => {
    const row = filtered.values[rowOrder];
    if (isRowAggregate(row)) {
      const newItems = filterRows(row.rows, filters);
      row.rows = newItems;
      row.size = getAggSize(filtered.values[rowOrder]);
    }
    if (filtered.values[rowOrder].size <= 0) {
      delete filtered.values[rowOrder];
      filtered.order = filtered.order.filter((agg) => agg !== rowOrder);
    }
  });

  return filtered;
}
