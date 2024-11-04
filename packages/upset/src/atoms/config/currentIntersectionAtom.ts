import { Bookmark, Row } from '@visdesignlab/upset2-core';
import { selector, selectorFamily } from 'recoil';

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
 * Selector to determine if a row is bookmarked.
 *
 * This selector uses the `bookmarkSelector` to get the list of bookmarks and checks if the given row
 * is present in that list by comparing the row's ID with the IDs of the bookmarks.
 *
 * @param row - The row to check for being bookmarked.
 * @returns A boolean indicating whether the row is bookmarked.
 */
export const isRowBookmarkedSelector = selectorFamily<boolean, Row>({
  key: 'is-row-bookmarked',
  get: (row: Row) => ({ get }) => {
    const bookmarks = get(bookmarkSelector);
    return bookmarks.some(b => b.id === row.id);
  },
});

/**
 * Selector to get the color associated with a bookmarked row OR to get the next color if the row is not bookmarked.
 *
 * This selector uses the `bookmarkedColorPalette` to find the color for the given row.
 * If the row does not have a color in the palette, it falls back to the `nextColorSelector`.
 *
 * @param row - The row for which the color is being selected.
 * @returns The color associated with the given row.
 */
export const BookmarkedColorSelector = selectorFamily<string, Row>({
  key: 'bookmarked-color-selector',
  get: (row: Row) => ({ get }) => {
    const palette = get(bookmarkedColorPalette);
    const nextColor = get(nextColorSelector);
    return palette[row.id] || nextColor;
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
