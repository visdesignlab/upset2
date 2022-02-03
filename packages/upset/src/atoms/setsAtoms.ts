import { Sets } from '@visdesignlab/upset2-core';
import { atom, selector } from 'recoil';

export const setsAtom = atom<Sets>({
  key: 'sets',
  default: {},
});

const defaultVSets = selector<string[]>({
  key: 'defVSets',
  get: ({ get }) => {
    const sets = get(setsAtom);
    const setList = Object.keys(sets);
    return setList.splice(0, 6);
  },
});

const calculatedVSets = atom<string[]>({
  key: 'calcVSet',
  default: [],
});

export const visibleSetsAtom = selector<string[]>({
  key: 'visibleSets',
  get: ({ get }) => {
    const calc = get(calculatedVSets);
    const def = get(defaultVSets);

    return calc.length > 0 ? calc : def;
  },
  set: ({ set }, val) => {
    set(calculatedVSets, val);
  },
});
