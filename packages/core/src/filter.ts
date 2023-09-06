import { getAggSize } from './aggregate';
import {
  Aggregates, Intersections, areRowsSubsets, Rows, getDegreeFromSetMembership,
} from './types';
import { deepCopy } from './utils';

function filterIntersections<T extends Intersections>(
  rows: T,
  filters: { maxVisible: number; minVisible: number; hideEmpty: boolean, hideNoSet: boolean },
) {
  const { values, order } = rows;

  const newOrder = order.filter((id) => {
    const subset = values[id];
    const degree = getDegreeFromSetMembership(subset.setMembership);

    // determine if the subset is within the filter range and meets the hide conditions
    if ((degree >= filters.minVisible && degree <= filters.maxVisible) || subset.type === 'Aggregate') {
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

export function filterRows(
  baseRows: Rows,
  filters: { maxVisible: number; minVisible: number; hideEmpty: boolean, hideNoSet: boolean },
): Rows {
  const rows = deepCopy(baseRows);

  if (areRowsSubsets(rows)) {
    return filterIntersections(rows, filters);
  }

  const aggs: Aggregates = filterIntersections(rows as any, filters) as any;

  aggs.order.forEach((aggId) => {
    const { items } = aggs.values[aggId];

    const newItems = filterRows(items, filters);

    aggs.values[aggId].items = newItems;

    aggs.values[aggId].size = getAggSize(aggs.values[aggId]);

    if (aggs.values[aggId].size <= 0) {
      delete aggs.values[aggId];
      aggs.order = aggs.order.filter((agg) => agg !== aggId);
    }
  });

  return aggs;
}
