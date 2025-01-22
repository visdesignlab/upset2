import { selector } from 'recoil';
import { upsetConfigAtom } from './upsetConfigAtoms';

/**
 * Whether to show the intersection size labels; from the config.
 */
export const showIntersectionSizesSelector = selector<boolean>({
  key: 'show-intersection-size-labels',
  get: ({ get }) => get(upsetConfigAtom).intersectionSizeLabels,
});

/**
 * Whether to show the set size labels; from the config.
 */
export const showSetSizesSelector = selector<boolean>({
  key: 'show-set-size-labels',
  get: ({ get }) => get(upsetConfigAtom).setSizeLabels,
});

/**
 * Whether to show hidden sets; from the config.
 */
export const showHiddenSetsSelector = selector<boolean>({
  key: 'show-hidden-sets',
  get: ({ get }) => get(upsetConfigAtom).showHiddenSets,
});
