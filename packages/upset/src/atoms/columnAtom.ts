import { atom } from 'recoil';

export const columnsAtom = atom<string[]>({
  key: 'all-columns',
  default: [],
});
