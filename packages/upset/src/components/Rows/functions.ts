import {
  Aggregate, BaseIntersection, ElementSelection, Item,
} from '@visdesignlab/upset2-core';

/**
 * Returns the number of selected items in the subset based on an element selection.
 * @param items     Items in the subset.
 * @param selection Parameters for the selection.
 */
export function countSubsetSelected(items: Item[], selection: ElementSelection | undefined): number {
  if (!selection || Object.keys(selection).length === 0) return 0;
  let count = 0;
  items.forEach((item) => {
    if (Object.entries(selection).every(
      ([key, value]) => typeof item[key] === 'number'
        && item[key] as number >= value[0] && item[key] as number <= value[1],
    )) count++;
  });
  return count;
}

/**
 * Count the number of selected items in an aggregate.
 * @param agg       The aggregate to count selected items in.
 * @param selection The selection to use for counting.
 * @param getItems  Function to get items in a subset. The id param is the subset id.
 */
export function countAggregateSelected(agg: Aggregate, selection: ElementSelection | undefined, getItems: (id: string) => Item[]): number {
  let total = 0;
  // Type cast isn't necessary here, but it's included for clarity.
  Object.entries(agg.items.values as { [id: string]: BaseIntersection | Aggregate }).forEach(([id, value]) => {
    total += Object.hasOwn(value, 'aggregateBy')
      ? countAggregateSelected(value as Aggregate, selection, getItems)
      : countSubsetSelected(getItems(id), selection);
  });
  return total;
}
