import { Item } from '@visdesignlab/upset2-core';
import { selectorFamily } from 'recoil';

import { bookmarkedColorPalette, currentIntersectionAtom, nextColorSelector } from './config/currentIntersectionAtom';
import { itemsAtom } from './itemsAtoms';
import { flattenedOnlyRows } from './renderRowsAtom';

export const elementSelector = selectorFamily<Item[], string>({
  key: 'element-item',
  get:
    (id: string) =>
    ({ get }) => {
      const items = get(itemsAtom);
      const intersections = get(flattenedOnlyRows);
      const row = intersections[id];
      const palette = get(bookmarkedColorPalette);
      const currentIntersection = get(currentIntersectionAtom);

      if (!row) return [];

      const memberElements = row.items as string[];

      return memberElements.map((el) => ({
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

export const elementItemMapSelector = selectorFamily<Item[], string[]>({
  key: 'element-item-map',
  get:
    (ids: string[]) =>
    ({ get }) => {
      const currentIntersection = get(currentIntersectionAtom);
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
