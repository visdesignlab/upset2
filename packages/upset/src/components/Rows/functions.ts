import { Aggregate, BaseIntersection, ElementSelection, Item } from "@visdesignlab/upset2-core";

/**
 * Returns the number of selected items in the subset based on an element selection.
 * @param items     Items in the subset.
 * @param selection Parameters for the selection.
 */
export function countSubsetSelected(items: Item[], selection: ElementSelection | undefined): number {
  if (!selection) return 0;
  let count = 0;
  for (const item of items) {
    if (Object.entries(selection).every(([key, value]) => {
      return typeof item[key] === 'number' &&
        item[key] as number >= value[0] && item[key] as number <= value[1]
    })) count++;
  } return count;
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
  for (const [id, value] of Object.entries(agg.items.values as { [id: string]: BaseIntersection | Aggregate })) {
    total += value.hasOwnProperty('aggregateBy') 
      ? countAggregateSelected(value as Aggregate, selection, getItems) 
      : countSubsetSelected(getItems(id), selection);
  }
  return total;
}