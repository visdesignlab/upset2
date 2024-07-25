import { atom } from 'recoil';

export const userEditPermsAtom = atom<boolean>({
  key: 'user-edit-perms',
  default: false,
});
