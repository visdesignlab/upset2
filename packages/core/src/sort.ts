import { areRowsSubsets, Subsets, Rows, SortBy } from './types';

function sortSubsets(subsets: Subsets, sortBy: SortBy): Subsets {
  if (!sortBy) console.log(sortBy);

  const { values, order } = subsets;
  const newOrder = [...order].sort((b, a) => values[a].size - values[b].size);

  return { values, order: newOrder };
}

export function sortRows(rows: Rows, sortBy: SortBy): Rows {
  if (!sortBy) {
    console.log(sortBy);
  }

  if (areRowsSubsets(rows)) {
    return sortSubsets(rows, sortBy);
  }

  return rows;
}
