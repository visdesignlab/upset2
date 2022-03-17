import { Sets } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

export const setsAtom = atom<Sets>({
  key: 'sets',
  default: {},
});
