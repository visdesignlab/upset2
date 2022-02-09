import { Aggregates, Intersections, areRowsSubsets, Rows } from './types';
import { deepCopy } from './utils';

function filterIntersections<T extends Intersections>(
  rows: T,
  filters: { maxVisible: number; minVisible: number; hideEmpty: boolean },
) {
  const { values, order } = rows;

  const newOrder = order.filter((id) => {
    let shouldKeep = true;

    if (filters.hideEmpty) {
      shouldKeep = values[id].size > 0;
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
  });

  return aggs;
}
