import { selector } from 'recoil';

import { upsetConfigAtom } from './upsetConfigAtoms';

export const maxVisibleSelector = selector({
  key: 'maxVisible',
  get: ({ get }) => get(upsetConfigAtom).filters.maxVisible,
});

export const minVisibleSelector = selector({
  key: 'minVisible',
  get: ({ get }) => get(upsetConfigAtom).filters.minVisible,
});

export const hideEmptySelector = selector({
  key: 'hideEmpty',
  get: ({ get }) => get(upsetConfigAtom).filters.hideEmpty,
});
