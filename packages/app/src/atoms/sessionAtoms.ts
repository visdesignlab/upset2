import { atom } from 'recoil';

export const isPublicWorkspaceAtom = atom<boolean>({
  key: 'isPublicWorkspace',
  default: false,
});
