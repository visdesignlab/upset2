import { atom } from 'recoil';

export const queryBySetsInterfaceAtom = atom<boolean>({
  key: 'query-by-sets-interface',
  default: false,
});
