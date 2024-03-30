import { Bookmark, Row } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { queryColorPalette } from '../../utils/styles';
import { upsetConfigAtom } from './upsetConfigAtoms';


/**
 * Represents the currently selected intersection,
 * which is tracked by & pulled from the upsetConfigAtom.
 * Defaults to undefined in some cases, which is equivalent to null,
 * ie no intersection is selected.
 * @returns {Row | null | undefined} The currently selected intersection.
 */
export const currentIntersectionSelector = selector<Row | null | undefined>({
  key: 'current-intersection',
  get: ({ get }) => get(upsetConfigAtom).selected,
  // No setter; this should be set by calling actions.setSelected(intersection)
});

export const bookmarkedIntersectionSelector = selector<Bookmark[]>({
  key: 'bookmarked-intersection',
  get: ({ get }) => {
    const intersection = get(upsetConfigAtom).bookmarkedIntersections;

    return intersection;
  },
});

export const bookmarkedColorPalette = selector<{
  [intersection: string]: string;
}>({
  key: 'bookmark-color',
  get: ({ get }) => {
    const colorPalette: { [i: string]: string } = {};

    const bookmarks = get(bookmarkedIntersectionSelector);

    [...bookmarks].forEach((inter, idx) => {
      colorPalette[inter.id] = queryColorPalette[idx] || '#000';
    });

    return colorPalette;
  },
});

export const nextColorSelector = selector<string>({
  key: 'color-selector',
  get: ({ get }) => {
    const palette = get(bookmarkedColorPalette);
    const currentLength = Object.values(palette).length;

    if (currentLength > queryColorPalette.length) {
      return '#000';
    }
    return queryColorPalette[currentLength];
  },
});
