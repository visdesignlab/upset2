import { Row } from '@visdesignlab/upset2-core';
import { atom, selector } from 'recoil';

import { upsetConfigAtom } from './config/upsetConfigAtoms';

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
