import { getSubsets, Subsets } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';
import { itemsAtom } from './itemsAtoms';
import { setsAtom, visibleSetsAtom } from './setsAtoms';

export const subsetSelector = selector<Subsets>({
  key: 'subsets',
  get: ({ get }) => {
    const items = get(itemsAtom);
    const sets = get(setsAtom);
    const visibleSets = get(visibleSetsAtom);

    return getSubsets(items, sets, visibleSets);
  },
});
