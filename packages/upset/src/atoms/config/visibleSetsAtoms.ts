import { atom, selector } from 'recoil';

import { setsAtom } from '../setsAtoms';
import { upsetConfigAtom } from './upsetConfigAtoms';

export const visibleSetSelector = selector<string[]>({
  key: 'visibleSets',
  get: ({ get }) => get(upsetConfigAtom).visibleSets,
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
        setList.sort((a, b) =>
          sets[a].elementName > sets[b].elementName ? 1 : -1,
        );
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

export const hiddenSetSortAtom = atom<'Name' | 'Size - Asc' | 'Size - Desc'>({
  key: 'hidden-sets-sort',
  default: 'Size - Desc',
});
