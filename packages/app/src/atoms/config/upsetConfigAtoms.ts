import { UpsetConfig, DefaultConfig } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

// fields can be edited here to stray from default config
const config = { ...DefaultConfig };

export const upsetConfigAtom = atom<UpsetConfig>({
  key: 'app-config',
  default: config,
});
