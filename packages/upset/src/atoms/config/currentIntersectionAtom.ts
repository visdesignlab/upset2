import { Bookmark, Row } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { queryColorPalette } from '../../utils/styles';
import { upsetConfigAtom } from './upsetConfigAtoms';
import { selectedElementSelector } from '../elementsSelectors';

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

/**
 * Selector for bookmarks from the config atom
 */
export const bookmarkSelector = selector<Bookmark[]>({
  key: 'bookmarks',
  get: ({ get }) => get(upsetConfigAtom).bookmarks,
});

/**
 * Represents the color palette for the bookmarked intersections.
 * Maps intersection IDs to colors, both as strings.
 */
export const bookmarkedColorPalette = selector<{
  [intersection: string]: string;
}>({
  key: 'bookmark-color',
  get: ({ get }) => {
    const colorPalette: { [i: string]: string } = {};

    const bookmarks = get(bookmarkSelector);

    [...bookmarks].forEach((inter, idx) => {
      colorPalette[inter.id] = queryColorPalette[idx] || '#000';
    });

    return colorPalette;
  },
});

/**
 * The next color to be used for a newly bookmarked intersection;
 * comes from the queryColorPalette.
 */
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

/**
 * The color to use for the current element selection stored in the config
 */
export const elementColorSelector = selector<string>({
  key: 'element-selection-atom-color',
  get: ({ get }) => {
    const selection = get(selectedElementSelector);
    const bookmarkColors = get(bookmarkedColorPalette);
    const palette = get(bookmarkedColorPalette);

    if (selection && Object.keys(bookmarkColors).includes(selection.id)) {
      return bookmarkColors[selection.id];
    }

    return get(currentIntersectionSelector)
      ? queryColorPalette[Object.values(palette).length + 1]
      : get(nextColorSelector);
  },
});
