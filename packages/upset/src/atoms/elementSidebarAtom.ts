import { atom } from "recoil";

export const elementSidebarAtom = atom<boolean>({
    key: 'hide-element-sidebar',
    default: false,
  });