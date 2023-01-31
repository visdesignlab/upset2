import { Item, getItems } from '@visdesignlab/upset2-core';
import { selectorFamily } from 'recoil';
import { bookmarkedColorPalette, currentIntersectionAtom, nextColorSelector } from './config/currentIntersectionAtom';
import { itemsAtom } from './itemsAtoms';
import { flattenedOnlyRows } from './renderRowsAtom';

export const elementSelector = selectorFamily<
  Item[],
  string | null | undefined
>({
  key: 'element-item',
  get: (id: string | null | undefined) => ({ get }) => {
    if (!id) return [];

    const items = get(itemsAtom);
    const intersections = get(flattenedOnlyRows);
    const row = intersections[id];
    const palette = get(bookmarkedColorPalette);
    const currentIntersection = get(currentIntersectionAtom);

    if (!row) return [];

    const memberElements = getItems(row);

    return memberElements.map(el => ({
      ...items[el],
      subset: id,
      subsetName: row.elementName,
      color: palette[id] || get(nextColorSelector),
      isCurrentSelected: currentIntersection ? true : false,
      isCurrent:
        currentIntersection && currentIntersection.id === id ? true : false,
    }));
  },
});

export const intersectionCountSelector = selectorFamily<
  number,
  string | null | undefined
>({
  key: `intersection-count`,
  get: (id: string | null | undefined) => ({ get }) => {
    if (!id) return 0;

    const intersections = get(flattenedOnlyRows);
  
    if (intersections[id] === undefined) { return 0; }
    
    const row = intersections[id];
    return row.size;
  },
});

export const elementItemMapSelector = selectorFamily<Item[], string[]>({
  key: 'element-item-map',
  get: (ids: string[]) => ({ get }) => {
    const currentIntersection = get(currentIntersectionAtom);
    const items: Item[] = [];

    if (currentIntersection === null) return [];

    if (!ids.includes(currentIntersection.id)) {
        items.push(...get(elementSelector(currentIntersection.id)));
      }

      ids.forEach(id => {
        items.push(...get(elementSelector(id)));
      });
    
    return items;
  },
});
