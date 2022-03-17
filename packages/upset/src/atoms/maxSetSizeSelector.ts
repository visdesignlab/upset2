import { selector } from 'recoil';

import { setsAtom } from './setsAtoms';

export const maxSetSizeSelector = selector({
  key: 'max-set-size',
  get: ({ get }) => {
    const sets = get(setsAtom);

    const sizes = Object.values(sets).map((set) => set.size);
    const maxSize = Math.max(...sizes);

    return maxSize;
  },
});
