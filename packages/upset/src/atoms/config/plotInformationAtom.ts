import { selector } from 'recoil';
import { PlotInformation } from '@visdesignlab/upset2-core';
import { upsetConfigAtom } from './upsetConfigAtoms';

export const plotInformationSelector = selector<PlotInformation>({
  key: 'meta-data',
  get: ({ get }) => get(upsetConfigAtom).plotInformation,
});
