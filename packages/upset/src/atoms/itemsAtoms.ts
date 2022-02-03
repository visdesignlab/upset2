import { Items } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

export const itemsAtom = atom<Items>({
  key: 'items',
  default: {},
});
