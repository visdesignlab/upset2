import { UpsetConfig, DefaultConfig } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

// This config is overruled by any config provided by an external source
export const upsetConfigAtom = atom<UpsetConfig>({
  key: 'upset-config',
  default: DefaultConfig,
});
