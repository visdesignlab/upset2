import { ElementSelection, Item, flattenedOnlyRows, getItems } from '@visdesignlab/upset2-core';
import { selector, selectorFamily } from 'recoil';
import { bookmarkedColorPalette, currentIntersectionSelector, nextColorSelector } from './config/currentIntersectionAtom';
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
 * @returns The elements in the intersections, with properties for coloring and selection. 
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
export const elementSelectionSelector = selector<ElementSelection>({
  key: 'element-selection',
  get: ({ get }) => {
    const state = get(upsetConfigAtom);
    return state.elementSelection;
  },
});
