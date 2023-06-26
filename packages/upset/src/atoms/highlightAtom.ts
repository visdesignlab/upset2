import { atom } from 'recoil';

export const rowHoverAtom = atom<string | null>({
  key: 'row-hover',
  default: null,
});

export const columnHoverAtom = atom<string[]>({
  key: 'column-hover',
  default: [],
});
