import {
  Bookmark,
  QuerySelection,
  Row,
  SelectionType,
  VegaSelection,
} from '@visdesignlab/upset2-core';
import { selector, selectorFamily } from 'recoil';

import { extraQueryColor, queryColorPalette } from '../../utils/styles';
import { upsetConfigAtom } from './upsetConfigAtoms';

/**
 * The current vega selection from the config
 */
export const currentVegaSelection = selector<VegaSelection | null>({
  key: 'vega-selection-selector',
  get: ({ get }) => get(upsetConfigAtom).vegaSelection,
});

/**
 * The current query selection from the config
 */
export const currentQuerySelection = selector<QuerySelection | null>({
  key: 'query-selection-selector',
  get: ({ get }) => get(upsetConfigAtom).querySelection,
});

/**
 * The currently active selection type from the config
 */
export const currentSelectionType = selector<SelectionType | null>({
  key: 'config-active-selection',
  get: ({ get }) => get(upsetConfigAtom).selectionType,
});

/**
 * Represents the currently selected intersection,
 * which is tracked by & pulled from the upsetConfigAtom.
 * Defaults to undefined in some cases, which is equivalent to null,
 * ie no intersection is selected.
 * @returns {Row | null | undefined} The currently selected intersection.
 */
export const currentIntersectionSelector = selector<Row | null | undefined>({
  key: 'current-intersection',
  get: ({ get }) => get(upsetConfigAtom).rowSelection,
});

/**
 * Selector for bookmarks from the config atom
 */
export const bookmarkSelector = selector<Bookmark[]>({
  key: 'bookmarks',
  get: ({ get }) => get(upsetConfigAtom).bookmarks,
});

/**
 * Gets the color palette index to be used for the (color of the) next bookmark.
 * This is the next available color index in the color palette.
 * If all colors are used, the next color index will be the length of the color palette.
 * @returns {number} The next color index to be used for a new bookmark.
 */
export const nextColorIndexSelector = selector<number>({
  key: 'next-color-index-selector',
  get: ({ get }) => {
    const bookmarks = get(bookmarkSelector);
    const used = new Set(bookmarks.map((b) => b.colorIndex));

    for (let i = 0; i < queryColorPalette.length; i += 1) if (!used.has(i)) return i;
    return queryColorPalette.length;
  },
});

/**
 * The next color to be used for a newly bookmarked intersection; comes from the queryColorPalette.
 * @private the method used to determine next color needs to be the same as in useSyncBookmarkPalette for consistency
 */
export const nextColorSelector = selector<string>({
  key: 'next-color-selector',
  get: ({ get }) => {
    const nextIndex = get(nextColorIndexSelector);
    return nextIndex < queryColorPalette.length
      ? queryColorPalette[nextIndex]
      : extraQueryColor;
  },
});

/**
 * Get the color associated with a bookmark.
 * If the provided ID is not a bookmark (or is undefined), the nextColor will be used instead.
 * If the provided ID does not already have a color assigned, it is assigned one.
 * @param {id} The ID of the bookmark to get the color for.
 * @returns {string} The hex color associated with the bookmark ID, or nextColor if the ID is not bookmarked
 */
export const bookmarkColorSelector = selectorFamily<string, string | undefined>({
  key: 'bookmark-color-selector',
  get:
    (id) =>
    ({ get }) => {
      const bookmarks = get(bookmarkSelector);
      const nextColor = get(nextColorSelector);

      if (id === undefined) return nextColor;

      const bookmark = bookmarks.find((b) => b.id === id);
      if (bookmark) {
        return bookmark.colorIndex < queryColorPalette.length
          ? queryColorPalette[bookmark.colorIndex]
          : extraQueryColor;
      }

      return nextColor;
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
  get:
    (row: Row) =>
    ({ get }) => {
      const bookmarks = get(bookmarkSelector);
      return bookmarks.some((b) => b.id === row.id);
    },
});

/**
 * Selector to determine if a row is either bookmarked or currently selected
 * @param row - The row to check
 * @returns A boolean indicating whether the row is either bookmarked or currently selected
 */
export const isRowBookmarkedOrSelected = selectorFamily<boolean, Row>({
  key: 'is-row-bookmarked-or-selected',
  get:
    (row: Row) =>
    ({ get }) => {
      const isBookmarked = get(isRowBookmarkedSelector(row));
      const currentIntersection = get(currentIntersectionSelector);
      return isBookmarked || currentIntersection?.id === row.id;
    },
});
