import { getSubsets, Subsets } from '@visdesignlab/upset2-core';
import { selector } from 'recoil';

import { attributeAtom } from './attributeAtom';
import { visibleSetSelector } from './config/visibleSetsAtoms';
import { itemsAtom } from './itemsAtoms';
import { setsAtom } from './setsAtoms';

export const subsetSelector = selector<Subsets>({
  key: 'subsets',
  get: ({ get }) => {
    const items = get(itemsAtom);
    const sets = get(setsAtom);
    const visibleSets = get(visibleSetSelector);
    const attributeColumns = get(attributeAtom);

    return getSubsets(items, sets, visibleSets, attributeColumns);
  },
});
