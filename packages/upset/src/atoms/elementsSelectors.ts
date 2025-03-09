import {
  Aggregate,
  BaseIntersection,
  NumericalQuery, Item, Row, flattenedOnlyRows, getItems,
  filterItems,
  ElementSelection,
  AttQuery,
  FilteredItems,
} from '@visdesignlab/upset2-core';
import { selector, selectorFamily } from 'recoil';
import {
  bookmarkSelector, bookmarkedColorPalette, currentIntersectionSelector, nextColorSelector,
} from './config/currentIntersectionAtom';
import { itemsAtom } from './itemsAtoms';
import { dataAtom } from './dataAtom';
import { upsetConfigAtom } from './config/upsetConfigAtoms';
import { rowsSelector } from './renderRowsAtom';
import { DEFAULT_ELEMENT_COLOR } from '../utils/styles';

/**
 * Gets all items in the row/intersection represented by the provided ID.
 * @param id - The ID of the row to get items for.
 * @returns The items in the row
 */
const rowItemsSelector = selectorFamily<Item[], string | null | undefined>({
  key: 'row-items',
  get: (id: string | null | undefined) => ({ get }) => {
    if (!id) return [];

    const items = get(itemsAtom);
    const intersections = get(rowsSelector);
    const row = intersections[id];

    if (!row) return [];

    return getItems(row).map((el) => items[el]);
  },
});

/**
 * Gets all elements in the bookmarked intersections and the currently selected intersection,
 * with coloring and selection properties as well as a 'true' bookmarked property.
 * @returns The elements in the bookmarked/selected intersections with the following props added:
 * - subset: The ID of the row the item is in
 * - subsetName: The name of the row the item is in
 * - color: The color of the row the item is in
 * - isCurrentSelected: Whether the current intersection is selected
 * - isCurrent: Whether the item is in the current intersection
 * - bookmarked: Whether the item is in a bookmarked row (true)
 * @private These properties are deliberately only added to bookmarked items, as the current vega spec requires
 */
export const bookmarkedItemsSelector = selector<Item[]>({
  key: 'bookmarked-items',
  get: ({ get }) => {
    const bookmarkIDs = ([] as string[]).concat(get(bookmarkSelector).map((b) => b.id));
    const currentIntersection = get(currentIntersectionSelector);
    if (currentIntersection?.id && !bookmarkIDs.includes(currentIntersection?.id)) bookmarkIDs.push(currentIntersection?.id);

    const intersections = get(rowsSelector);
    const palette = get(bookmarkedColorPalette);
    const result: Item[] = [];

    bookmarkIDs.forEach((id) => {
      const row = intersections[id];
      if (!row) return;

      const memberElements = get(rowItemsSelector(id));
      result.push(...memberElements.map((el) => ({
        ...el,
        subset: id,
        subsetName: row.elementName,
        color: palette[id] || get(nextColorSelector),
        isCurrentSelected: !!currentIntersection,
        isCurrent: !!(currentIntersection?.id === id),
        bookmarked: true,
      })));
    });

    return result;
  },
});

/**
 * Gets all of the items in visible rows.
 * Items from bookmarked rows are given properties for coloring and selection, as well as a 'true' bookmarked property.
 * Other items are given only a color prop.
 * @private It seems odd for some items to have props that others don't; however,
 *   this is necessary for correct element vis with the current vega spec. It may be refactorable.
 */
export const processedItemsSelector = selector<Item[]>({
  key: 'processed-items',
  get: ({ get }) => {
    const rows = get(rowsSelector);
    const items = get(itemsAtom);
    const bookmarkedIDs = get(bookmarkSelector).map((b) => b.id);
    const currentIntersection = get(currentIntersectionSelector);
    // A wild assignment, but the array returned by Recoil is readonly and we need to add to it
    const result: Item[] = ([] as Item[]).concat(get(bookmarkedItemsSelector));

    Object.values(rows).forEach((row) => {
      if (!bookmarkedIDs.includes(row.id) && row.id !== currentIntersection?.id) {
        const memberElements = getItems(row);
        result.push(...memberElements.map((el) => ({
          ...items[el],
          color: DEFAULT_ELEMENT_COLOR,
        })));
      }
    });
    return result;
  },
});

/**
 * Gets the current selection of elements
 * @returns The current selection of elements
 */
export const elementSelectionSelector = selector<ElementSelection | null>({
  key: 'config-element-selection',
  get: ({ get }) => get(upsetConfigAtom).elementSelection,
});

/**
 * Gets all items that are currently displayed in intersections in the plot
 * (if the unincluded intersection is visible, this is all items)
 * sorted into included and excluded lists based on the current selection.
 * If no selection is active, all items are excluded.
 * @returns The included and excluded items
 */
const filteredItems = selector<FilteredItems>({
  key: 'filtered-items',
  get: ({ get }) => {
    const items = get(processedItemsSelector);
    const selection = get(elementSelectionSelector);
    if (!selection || !selection.active) return { included: [], excluded: items };

    return filterItems(items, selection);
  },
});

/**
 * Returns all items from any visible intersection that are within the bounds of the current element selection if active.
 * If inactive, returns all items within a bookmarked/selected intersection.
 * If no selections are active, and no rows are selected or bookmarked, returns all items in visible intersections.
 */
export const selectedOrBookmarkedItemsSelector = selector<Item[]>({
  key: 'selected-elements',
  get: ({ get }) => {
    if (get(elementSelectionSelector)?.active) return get(filteredItems).included;
    if (get(bookmarkSelector).length > 0 || get(currentIntersectionSelector)) return get(bookmarkedItemsSelector);
    return get(processedItemsSelector);
  },
});

/**
 * Gets all values for a given attribute for all items in a given row.
 * If the provided attribute does not exist or is not numeric,
 * outputs a console warning & returns an empty list.
 */
export const attValuesSelector = selectorFamily<number[], {row: Row, att: string}>({
  key: 'att-values',
  get: ({ row, att }) => ({ get }) => {
    const items = get(rowItemsSelector(row.id));

    // We could filter the whole array before we map, but attributes should all be the same type,
    // so its sufficient and more performant to only check the first attribute
    if (!items[0] || !items[0][att] || typeof items[0][att] !== 'number') {
      return [];
    }
    return items.map((item) => item[att] as number);
  },
});

/**
 * Gets the number of elements in the intersection represented by the provided ID
 * @param id - The ID of the intersection to get elements for.
 * @returns The number of elements in the intersection
 */
export const intersectionCountSelector = selectorFamily<
  number,
  string | null | undefined
>({
  key: 'intersection-count',
  get: (id: string | null | undefined) => ({ get }) => {
    if (!id) return 0;

    const data = get(dataAtom);
    const state = get(upsetConfigAtom);
    const intersections = flattenedOnlyRows(data, state);

    if (intersections[id] === undefined) { return 0; }

    const row = intersections[id];
    return row.size;
  },
});

/**
 * Gets the parameters for the current numerical selection of elements,
 * ie the 'selected' property of the selectedElementsSelector.
 * If the current selection is not numerical, returns undefined.
 */
export const currentNumericalQuery = selector<NumericalQuery | undefined>({
  key: 'config-current-element-selection',
  get: ({ get }) => {
    const elementSelection = get(elementSelectionSelector);
    return elementSelection?.type === 'numerical' && elementSelection.active ? elementSelection.query : undefined;
  },
});

/**
 * Gets the parameters for the current selection of elements,
 * ie the 'selected' property of the selectedElementsSelector.
 * If the current selection is not an element query, returns undefined.
 */
export const currentElementQuery = selector<AttQuery | undefined>({
  key: 'config-current-element-query',
  get: ({ get }) => {
    const elementSelection = get(elementSelectionSelector);
    return elementSelection?.type === 'element' && elementSelection.active ? elementSelection.query : undefined;
  },
});

/**
 * Counts the number of selected items.
 */
export const selectedItemsCounter = selector<number>({
  key: 'selected-item-count',
  get: ({ get }) => get(selectedOrBookmarkedItemsSelector).length,
});

/**
 * Counts the number of selected items in a subset.
 */
export const subsetSelectedCount = selectorFamily<number, string>({
  key: 'subset-selected',
  get: (id: string) => ({ get }) => {
    const items = get(rowItemsSelector(id));
    const selection = get(elementSelectionSelector);

    if (!selection || !selection.active) return 0;

    return filterItems(items, selection).included.length;
  },
});

/**
 * Counts the number of selected items in an aggregate.
 * Selection is taken from the current element selection in the config.
 */
export const aggregateSelectedCount = selectorFamily<number, Aggregate>({
  key: 'aggregate-selected',
  get: (agg: Aggregate) => ({ get }) => {
    let total = 0;
    Object.entries(agg.items.values as { [id: string]: BaseIntersection | Aggregate }).forEach(([id, value]) => {
      total += Object.prototype.hasOwnProperty.call(value, 'aggregateBy')
        ? get(aggregateSelectedCount(value as Aggregate))
        : get(subsetSelectedCount(id));
    });
    return total;
  },
});
