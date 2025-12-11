import { atom, selector } from 'recoil';

import { SortVisibleBy } from '@visdesignlab/upset2-core';
import { setsAtom } from '../setsAtoms';
import { upsetConfigAtom } from './upsetConfigAtoms';

export const visibleSetSelector = selector<string[]>({
  key: 'visible-sets',
  get: ({ get }) => {
    const sets = get(setsAtom);
    const { visibleSets } = get(upsetConfigAtom);
    const { sortVisibleBy } = get(upsetConfigAtom);
    let visibleSetList = [...visibleSets];

    switch (sortVisibleBy) {
      case 'Alphabetical':
        visibleSetList.sort();
        break;
      case 'Ascending':
        visibleSetList.sort((a, b) => sets[a].size - sets[b].size);
        break;
      case 'Descending':
        visibleSetList.sort((a, b) => sets[b].size - sets[a].size);
        break;
      default:
        if (typeof sortVisibleBy === 'string') {
          visibleSetList = (sortVisibleBy as string)
            .split(',')
            .map((s) => visibleSetList.find((vs) => vs === s) as string);
        }
        break;
    }
    return visibleSetList;
  },
});

export const visibleSortSelector = selector<SortVisibleBy>({
  key: 'visible-sort-by',
  get: ({ get }) => get(upsetConfigAtom).sortVisibleBy,
});

export const hiddenSetSortAtom = atom<'Name' | 'Size - Asc' | 'Size - Desc'>({
  key: 'hidden-sets-sort',
  default: 'Size - Desc',
});

export const hiddenSetSelector = selector<string[]>({
  key: 'hidden-sets',
  get: ({ get }) => {
    const visibleSets = get(visibleSetSelector);
    const sets = get(setsAtom);
    const setList = Object.keys(sets);
    const sortOrder = get(hiddenSetSortAtom);

    switch (sortOrder) {
      case 'Name':
        setList.sort((a, b) => (sets[a].elementName > sets[b].elementName ? 1 : -1));
        break;
      case 'Size - Asc':
        setList.sort((a, b) => sets[a].size - sets[b].size);
        break;
      case 'Size - Desc':
        setList.sort((b, a) => sets[a].size - sets[b].size);
        break;
      default:
        break;
    }

    return setList.filter((set) => !visibleSets.includes(set));
  },
});

// Atom to control visibility of custom order modal
export const customOrderModalAtom = atom<boolean>({
  key: 'custom-order-modal',
  default: false,
});
