import { atom } from 'recoil';

export const userEditPermsAtom = atom<boolean>({
  key: 'userEditPermsAtom',
  default: false,
});
