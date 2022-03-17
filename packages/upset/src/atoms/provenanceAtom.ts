import { UpsetConfig } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

import { defaultConfig } from './config/upsetConfigAtoms';

export const stateAtom = atom<UpsetConfig>({
  key: 'upset-state',
  default: defaultConfig,
});
