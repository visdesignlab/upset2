import { CoreUpsetData } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

export const dataAtom = atom<CoreUpsetData | Record<string, never>>({
  key: 'data',
  default: {},
});
