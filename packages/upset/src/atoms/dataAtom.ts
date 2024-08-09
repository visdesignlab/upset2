import { CoreUpsetData } from '@visdesignlab/upset2-core';
import { atom } from 'recoil';

/**
 * Atom to store the data for the Upset plot
 */
export const dataAtom = atom<CoreUpsetData | Record<string, never>>({
  key: 'data',
  default: {},
});