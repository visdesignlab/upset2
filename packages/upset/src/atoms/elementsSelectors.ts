import {
  Aggregate,
  BaseIntersection,
  NumericalQuery, Item, Row, flattenedOnlyRows, getItems,
  ElementSelection,
  filterItems,
  ElementQuery,
} from '@visdesignlab/upset2-core';
import { selector, selectorFamily } from 'recoil';
import {
  bookmarkSelector, bookmarkedColorPalette, currentIntersectionSelector, nextColorSelector,
} from './config/currentIntersectionAtom';
import { itemsAtom } from './itemsAtoms';
import { dataAtom } from './dataAtom';
import { upsetConfigAtom } from './config/upsetConfigAtoms';
import { rowsSelector } from './renderRowsAtom';

/**
 * Gets all elements in the intersection represented by the provided ID
 * @param id - The ID of the intersection to get elements for.
 * @returns The elements in the intersection, with properties for coloring and selection.
 */
export const elementSelector = selectorFamily<
  Item[],
  string | null | undefined
>({
  key: 'element-item',
  get: (id: string | null | undefined) => ({ get }) => {
    if (!id) return [];

    const items = get(itemsAtom);
    const intersections = get(rowsSelector);
    const row = intersections[id];
    const palette = get(bookmarkedColorPalette);
    const currentIntersection = get(currentIntersectionSelector);

    if (!row) return [];

    const memberElements = getItems(row);

    return memberElements.map((el) => ({
      ...items[el],
      subset: id,
      subsetName: row.elementName,
      color: palette[id] || get(nextColorSelector),
      isCurrentSelected: !!currentIntersection,
      isCurrent:
        !!(currentIntersection?.id === id),
    }));
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
    const items = get(elementSelector(row.id));

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
 * Gets all elements in intersections represented by the provided IDs
 * and the currently selected intersection
 * @param ids - The IDs of the intersections to get elements for.
 * @returns The elements in the intersections
 */
export const elementItemMapSelector = selectorFamily<Item[], string[]>({
  key: 'element-item-map',
  get: (ids: string[]) => ({ get }) => {
    const currentIntersection = get(currentIntersectionSelector);
    const items: Item[] = [];

    if (currentIntersection && !ids.includes(currentIntersection.id)) {
      items.push(...get(elementSelector(currentIntersection.id)));
    }

    ids.forEach((id) => {
      items.push(...get(elementSelector(id)));
    });

    return items;
  },
});

/**
 * Gets all elements in the bookmarked intersections and the currently selected intersection.
 * If no intersections are bookmarked, returns all elements
 * @returns The elements in the bookmarked intersections
 */
export const elementsInBookmarkSelector = selector<Item[]>({
  key: 'bookmarked-elements',
  get: ({ get }) => {
    const bookmarks = get(bookmarkSelector);
    const items: Item[] = get(elementItemMapSelector(bookmarks.map((b) => b.id)));

    if (items.length === 0) return Object.values(get(itemsAtom)).map((item) => ({ ...item, color: '#444' }));
    return items;
  },
});

/**
 * Gets the current selection of elements
 * @returns The current selection of elements
 */
export const selectedElementSelector = selector<ElementSelection | null>({
  key: 'config-element-selection',
  get: ({ get }) => get(upsetConfigAtom).elementSelection,
});

/**
 * Gets the parameters for the current numerical selection of elements,
 * ie the 'selected' property of the selectedElementsSelector.
 * If the current selection is not numerical, returns undefined.
 */
export const currentNumericalQuery = selector<NumericalQuery | undefined>({
  key: 'config-current-element-selection',
  get: ({ get }) => {
    const elementSelection = get(selectedElementSelector);
    return elementSelection?.type === 'numerical' ? elementSelection.selection : undefined;
  },
});

/**
 * Gets the parameters for the current selection of elements,
 * ie the 'selected' property of the selectedElementsSelector.
 * If the current selection is not an element query, returns undefined.
 */
export const currentElementQuery = selector<ElementQuery | undefined>({
  key: 'config-current-element-query',
  get: ({ get }) => {
    const elementSelection = get(selectedElementSelector);
    return elementSelection?.type === 'element' ? elementSelection.selection : undefined;
  },
});

/**
 * Returns all items that are in a bookmarked intersection OR the currently selected intersection
 * AND are within the bounds of the current element selection.
 * If no selections are active and no rows are bookmarked, returns all items.
 */
export const selectedItemsSelector = selector<Item[]>({
  key: 'selected-elements',
  get: ({ get }) => {
    const items: Item[] = get(elementsInBookmarkSelector);
    const selection = get(selectedElementSelector);
    if (!selection) return items;

    return filterItems(items, selection);
  },
});

/**
 * Counts the number of selected items.
 */
export const selectedItemsCounter = selector<number>({
  key: 'selected-item-count',
  get: ({ get }) => get(selectedItemsSelector).length,
});

/**
 * Counts the number of selected items in a subset.
 */
export const subsetSelectedCount = selectorFamily<number, string>({
  key: 'subset-selected',
  get: (id: string) => ({ get }) => {
    const items = get(elementSelector(id));
    const selection = get(selectedElementSelector);

    if (!selection) return 0;

    return filterItems(items, selection).length;
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
