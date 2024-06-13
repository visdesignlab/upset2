import { atom } from 'recoil';

export const allowAttributeRemovalAtom = atom<boolean>({
  key: 'allow-attribute-removal',
  default: true,
});
