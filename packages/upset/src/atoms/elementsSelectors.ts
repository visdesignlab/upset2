import {
  Aggregate,
  BaseIntersection,
  NumericalQuery, Item, flattenedOnlyRows, getItems,
  ElementSelection,
  filterItems,
} from '@visdesignlab/upset2-core';
import { selector, selectorFamily } from 'recoil';
import {
  bookmarkSelector, bookmarkedColorPalette, currentIntersectionSelector, nextColorSelector,
} from './config/currentIntersectionAtom';
import { itemsAtom } from './itemsAtoms';
import { dataAtom } from './dataAtom';
import { upsetConfigAtom } from './config/upsetConfigAtoms';

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
    const data = get(dataAtom);
    const state = get(upsetConfigAtom);
    const intersections = flattenedOnlyRows(data, state);
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
 * Gets the current selection of elements
 * @returns The current selection of elements
 */
export const selectedElementSelector = selector<ElementSelection | null>({
  key: 'config-element-selection',
  get: ({ get }) => get(upsetConfigAtom).elementSelection,
});

/**
 * Gets the parameters for the current selection of elements,
 * ie the 'selected' property of the selectedElementsSelector
 */
export const currentNumericalQuery = selector<NumericalQuery | undefined>({
  key: 'config-current-element-selection',
  get: ({ get }) => {
    const elementSelection = get(selectedElementSelector);
    return elementSelection?.type === 'numerical' ? elementSelection.selection : undefined;
  },
});

/**
 * Returns all items that are in a bookmarked intersection OR the currently selected intersection
 * AND are within the bounds of the current element selection.
 */
export const selectedItemsSelector = selector<Item[]>({
  key: 'selected-elements',
  get: ({ get }) => {
    const bookmarks = get(bookmarkSelector);
    const items: Item[] = get(elementItemMapSelector(bookmarks.map((b) => b.id)));
    const selection = get(selectedElementSelector);
    if (!selection) return [];

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
      total += Object.hasOwn(value, 'aggregateBy')
        ? get(aggregateSelectedCount(value as Aggregate))
        : get(subsetSelectedCount(id));
    });
    return total;
  },
});
