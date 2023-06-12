import { atom } from 'recoil';

export const rowHoverAtom = atom<string | null>({
  key: 'row-hover',
  default: null,
});

export const columnHoverAtom = atom<string | null>({
  key: 'column-hover',
  default: null,
});

export const columnSelectAtom = atom<string | null>({
  key: 'column-select',
  default: null
});
