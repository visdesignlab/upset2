import { SortBy } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { upsetConfigAtom } from './upsetConfigAtoms';

export const sortBySelector = selector<SortBy>({
  key: 'sortBy',
  get: ({ get }) => get(upsetConfigAtom).sortBy,
});
