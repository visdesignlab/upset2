import { selector } from 'recoil';

import { upsetConfigAtom } from './upsetConfigAtoms';

export const maxVisibleSelector = selector({
  key: 'max-visible',
  get: ({ get }) => get(upsetConfigAtom).filters.maxVisible,
});

export const minVisibleSelector = selector({
  key: 'min-visible',
  get: ({ get }) => get(upsetConfigAtom).filters.minVisible,
});

export const hideEmptySelector = selector({
  key: 'hide-empty',
  get: ({ get }) => get(upsetConfigAtom).filters.hideEmpty,
});
