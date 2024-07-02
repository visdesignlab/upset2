import { selector } from 'recoil';
import { upsetConfigAtom } from './upsetConfigAtoms';
import { PlotInformation } from '@visdesignlab/upset2-core';

export const plotInformationSelector = selector<PlotInformation>({
  key: 'meta-data',
  get: ({ get }) => get(upsetConfigAtom).plotInformation,
});
