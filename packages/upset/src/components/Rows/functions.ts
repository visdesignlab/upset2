import { Aggregate, BaseIntersection, ElementSelection, Item } from "@visdesignlab/upset2-core";

/**
 * Returns the number of selected items in the subset based on an element selection.
 * @param items     Items in the subset.
 * @param selection Parameters for the selection.
 */
export function subsetSelectedCount(items: Item[], selection: ElementSelection): number {
  let count = 0;
  for (const item of items) {
    for (const [key, value] of Object.entries(selection)) {
      if (typeof item[key] === 'number' &&
        item[key] as number >= value[0] && item[key] as number <= value[1]
      ) {
        count++;
      }
    }
  } return count;
}

export function aggregateSelectedCount(agg: Aggregate, selection: ElementSelection, getItems: (id: string) => Item[]): number {
  let total = 0;
  // Type cast isn't necessary here, but it's included for clarity.
  for (const [id, value] of Object.entries(agg.items.values as { [id: string]: BaseIntersection | Aggregate })) {
    total += value.hasOwnProperty('aggregateBy') 
      ? aggregateSelectedCount(value as Aggregate, selection, getItems) 
      : subsetSelectedCount(getItems(id), selection);
  }
  return total;
}