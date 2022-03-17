import { selector } from 'recoil';

import { upsetConfigAtom } from './upsetConfigAtoms';

export const visibleAttributesSelector = selector<string[]>({
  key: 'visible-attribute',
  get: ({ get }) => get(upsetConfigAtom).visibleAttributes,
});
