import { Item, Row, SelectionType, getNumericValue } from '@visdesignlab/upset2-core';
import { VegaItem } from './types';

export function getVegaCompatibleAttributes(item: Item): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(item.atts).map(([key, value]) => {
      const numericValue = getNumericValue(value);
      if (value instanceof Date) return [key, numericValue ?? value.toISOString()];
      return [key, value];
    }),
  ) as Record<string, string | number | boolean>;
}

/**
 * Converts an item to a VegaItem by flattening its attributes and adding selection properties
 * @param item The item to convert
 * @param currentIntersection The currently selected intersection, if any
 * @param selectionType The current selection type
 * @param defaultElementColor The default color for elements (not belonging to a subset) in the element view plots
 * @param bookmarkProps If the item is a bookmark, this should be an object; otherwise, it should be false
 *   @param bookmarkProps.rowID The ID of the row for the bookmark
 *   @param bookmarkProps.rowName The name of the row for the bookmark
 *   @param bookmarkProps.color The color of the bookmark (retrieved from the bookmarkColorSelector)
 * @returns A VegaItem which can be passed in a list into the data field of a Vega plot;
 *  these items are compatible with the Vega spec in generatePlotSpec.ts
 */
export function itemToVega(
  item: Item,
  currentIntersection: Row | null | undefined,
  selectionType: SelectionType,
  defaultElementColor: string,
  bookmarkProps: { rowID: string; rowName: string; color: string } | false,
): VegaItem {
  return {
    ...getVegaCompatibleAttributes(item),
    color: defaultElementColor,
    ...(bookmarkProps
      ? {
          subset: bookmarkProps.rowID,
          subsetName: bookmarkProps.rowName,
          color: bookmarkProps.color,
        }
      : {}),
    isCurrentSelected: !!currentIntersection,
    isCurrent: bookmarkProps && currentIntersection?.id === bookmarkProps.rowID,
    bookmarked: !!bookmarkProps,
    ...(selectionType ? { selectionType } : {}),
  };
}
