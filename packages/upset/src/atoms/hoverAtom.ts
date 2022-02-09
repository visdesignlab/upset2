import { atom } from 'recoil';

export const rowHoverAtom = atom<string | null>({
  key: 'rowHover',
  default: null,
});

export const columnHoverAtom = atom<string | null>({
  key: 'columnHover',
  default: null,
});
