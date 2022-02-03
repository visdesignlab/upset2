import { areRowsSubsets, Subsets, Rows } from './types';

function filterSubsets(
  subsets: Subsets,
  filters: { maxVisible: number; minVisible: number; hideEmpty: boolean },
): Subsets {
  if (filters.hideEmpty) {
    const { values, order } = subsets;

    const newOrder = order.filter((id) => values[id].size > 0);

    const newValues: typeof values = {};

    newOrder.forEach((id) => {
      newValues[id] = values[id];
    });

    return { values: newValues, order: newOrder };
  }

  return subsets;
}

export function filterRows(
  rows: Rows,
  filters: { maxVisible: number; minVisible: number; hideEmpty: boolean },
): Rows {
  if (areRowsSubsets(rows)) {
    return filterSubsets(rows, filters);
  }

  return rows;
}
