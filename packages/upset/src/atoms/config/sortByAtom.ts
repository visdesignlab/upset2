import { SortBy, SortByOrder } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { upsetConfigAtom } from './upsetConfigAtoms';

export const sortBySelector = selector<SortBy>({
  key: 'sort-by',
  get: ({ get }) => get(upsetConfigAtom).sortBy,
});

export const sortByOrderSelector = selector<SortByOrder>({
  key: 'sort-by-order',
  get: ({ get }) => get(upsetConfigAtom).sortByOrder,
});
