import { atom } from 'recoil';

export const altTextSidebarAtom = atom<boolean>({
  key: 'alt-text-sidebar-state',
  default: true,
});
