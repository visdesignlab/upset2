import {
  Bookmark, QuerySelection, Row, SelectionType, VegaSelection,
} from '@visdesignlab/upset2-core';
import {
  atom, selector, selectorFamily, useRecoilState, useRecoilValue,
} from 'recoil';

import { useEffect } from 'react';
import { queryColorPalette } from '../../utils/styles';
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
 * Stores the color palette for bookmarks
 * This atom holds a mapping of bookmark IDs to their respective colors.
 * Not exported as it should not be accessed directly; use the `bookmarkColor` selector instead.
 */
const colorPaletteAtom = atom<{[id: string]: string}>({
  key: 'color-palette-atom',
  default: {},
});

/**
 * Finds the next free color in the `queryColorPalette`
 * @private Abstracted to a function to ensure logical consistency between nextColorSelector and useSyncBookmarkPalette
 * @param currentPalette The current color palette for bookmarks from the `colorPaletteAtom`
 * @returns Hex of the next free color or #000 (black) if all colors are used
 */
function findNextColor(currentPalette: Readonly<Record<string, string>>): string {
  const usedColors = new Set(Object.values(currentPalette));

  for (const color of queryColorPalette) { // Need to use for loop so we can return from inside
    if (!usedColors.has(color)) {
      return color;
    }
  }
  return '#000'; // Fallback to black
}

/**
 * The next color to be used for a newly bookmarked intersection; comes from the queryColorPalette.
 * @private the method used to determine next color needs to be the same as in useSyncBookmarkPalette for consistency
 */
export const nextColorSelector = selector<string>({
  key: 'next-color-selector',
  get: ({ get }) => findNextColor(get(colorPaletteAtom)),
});

/**
 * A hook (or component) responsible for synchronizing the colorPaletteAtom
 * with the current list of bookmarks. Assigns colors to new bookmarks
 * and implicitly prunes colors for removed bookmarks.
 *
 * This should be run near the root of the component tree to ensure that the color palette remains in sync
 */
export function useSyncBookmarkPalette() {
  const bookmarks = useRecoilValue(bookmarkSelector);
  const [palette, setPalette] = useRecoilState(colorPaletteAtom);

  useEffect(() => {
    const bookmarkIDs = new Set(bookmarks.map((b) => b.id));
    const newPalette = { ...palette }; // Create a shallow copy of the current palette as it's readonly
    const paletteIDs = Object.keys(newPalette);
    let needsUpdate = false; // Necessary to prevent infinite loops

    // First, prune the palette of any colors that are no longer associated with bookmarks
    paletteIDs.forEach((id) => {
      if (!bookmarkIDs.has(id)) {
        delete newPalette[id];
        needsUpdate = true;
      }
    });

    // Second, assign colors to new bookmarks
    bookmarkIDs.forEach((id) => {
      if (!newPalette[id]) {
        newPalette[id] = findNextColor(newPalette);
        needsUpdate = true;
      }
    });

    // Only update if needed to prevent infinite loops (this effect re-runs when palette changes)
    if (needsUpdate) setPalette(newPalette);
  }, [bookmarks, palette, setPalette]);
}

/**
 * Get the color associated with a bookmark.
 * If the provided ID is not a bookmark (or is undefined), the nextColor will be used instead.
 * If the provided ID does not already have a color assigned, it is assigned one.
 * @param {id} The ID of the bookmark to get the color for.
 * @returns {string} The hex color associated with the bookmark ID, or nextColor if the ID is not bookmarked
 */
export const bookmarkColorSelector = selectorFamily<string, string | undefined>({
  key: 'bookmark-color-selector',
  get: (id) => ({ get }) => (id ?
    get(colorPaletteAtom)[id] ?? get(nextColorSelector)
    : get(nextColorSelector)),
});

/**
 * @returns The current color palette used for bookmarks
 * @private used to make the atom readonly to external access
 */
export const colorPaletteSelector = selector<Record<string, string>>({
  key: 'color-palette-selector',
  get: ({ get }) => get(colorPaletteAtom),
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
  get: (row: Row) => ({ get }) => {
    const isBookmarked = get(isRowBookmarkedSelector(row));
    const currentIntersection = get(currentIntersectionSelector);
    return isBookmarked || currentIntersection?.id === row.id;
  },
});
