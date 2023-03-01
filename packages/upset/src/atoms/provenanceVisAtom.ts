import { atom } from 'recoil';

export const provenanceVisAtom = atom<boolean>({
  key: 'provenance-vis-state',
  default: false,
});
