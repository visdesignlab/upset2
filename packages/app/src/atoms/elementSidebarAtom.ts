import { atom } from 'recoil';

export const elementSidebarAtom = atom<boolean>({
  key: 'element-sidebar-state',
  default: false,
});
