import { atom } from 'recoil';

export const dataTableAtom = atom<boolean>({
  key: 'data-table-state',
  default: false,
});