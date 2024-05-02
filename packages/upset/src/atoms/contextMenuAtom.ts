import { atom } from 'recoil';
import { ContextMenuInfo } from '../types';

export const contextMenuAtom = atom<ContextMenuInfo | null>({
  key: 'context-menu-display-state',
  default: null,
});
