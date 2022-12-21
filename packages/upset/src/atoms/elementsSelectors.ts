import { isRowAggregate, Item } from '@visdesignlab/upset2-core';
import { getItems } from '@visdesignlab/upset2-core';
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

    // allows aggregate rows to be selected via getItems method
    // TODO: fix issue for nested aggregation return the wrong row
    // TODO: add the list of items to aggregate upon creation rather than when queried
    const memberElements = (isRowAggregate(row) ? getItems(row) : row.items as string[]);

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
    const row = intersections[id];
    console.log(id);
    console.log(intersections);
    return row.size;
  },
});

export const elementItemMapSelector = selectorFamily<Item[], string[]>({
  key: 'element-item-map',
  get: (ids: string[]) => ({ get }) => {
    const currentIntersection = get(currentIntersectionAtom);
    const items: Item[] = [];

    if (!currentIntersection) return [];

    if (!ids.includes(currentIntersection.id)) {
        items.push(...get(elementSelector(currentIntersection.id)));
      }

      ids.forEach(id => {
        items.push(...get(elementSelector(id)));
      });
    
    return items;
  },
});
