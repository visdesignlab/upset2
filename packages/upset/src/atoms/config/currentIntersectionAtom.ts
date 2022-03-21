import { Row } from '@visdesignlab/upset2-core';
import { atom, selector } from 'recoil';

import { queryColorPalette } from '../../utils/styles';
import { upsetConfigAtom } from './upsetConfigAtoms';

export const currentIntersectionAtom = atom<Row | null>({
  key: 'current-intersection',
  default: null,
});

export const bookmarkedIntersectionSelector = selector<string[]>({
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

    [...bookmarks].reverse().forEach((inter, idx) => {
      colorPalette[inter] = queryColorPalette[idx] || '#000';
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
