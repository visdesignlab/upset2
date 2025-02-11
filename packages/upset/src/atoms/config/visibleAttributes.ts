import { selector } from 'recoil';

import { upsetConfigAtom } from './upsetConfigAtoms';

/**
 * The attributes that are currently visible.
 */
export const visibleAttributesSelector = selector<string[]>({
  key: 'visible-attribute',
  get: ({ get }) => get(upsetConfigAtom).visibleAttributes,
});
