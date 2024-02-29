import { UpsetConfig, DefaultConfig } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

export const stateAtom = atom<UpsetConfig>({
  key: 'upset-state',
  default: DefaultConfig,
});
