import { getAggSize } from './aggregate';
import { Aggregates, Intersections, areRowsSubsets, Rows, getDegreeFromSetMembership } from './types';
import { deepCopy } from './utils';

function filterIntersections<T extends Intersections>(
  rows: T,
  filters: { maxVisible: number; minVisible: number; hideEmpty: boolean },
) {
  const { values, order } = rows;

  const newOrder = order.filter((id) => {
    let shouldKeep = false;
    const subset = values[id];
    const degree = getDegreeFromSetMembership(subset.setMembership);

    if ((degree >= filters.minVisible && degree <= filters.maxVisible) || subset.type === "Aggregate") {
      if (filters.hideEmpty) {
        shouldKeep = subset.size > 0;
      } else {
        shouldKeep = true;
      }
    }

    return shouldKeep;
  });

  const newValues: typeof values = {};

  newOrder.forEach((id) => {
    newValues[id] = values[id];
  });

  return { values: newValues, order: newOrder };
}

export function filterRows(
  baseRows: Rows,
  filters: { maxVisible: number; minVisible: number; hideEmpty: boolean },
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
      delete aggs.values[aggId]
      aggs.order = aggs.order.filter(agg => agg !== aggId)
    }
  });
  
  return aggs;
}
