import { CoreUpsetData } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

export const dataAtom = atom<CoreUpsetData | {}>({
  key: 'data',
  default: {},
});
