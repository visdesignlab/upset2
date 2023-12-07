import { selector } from 'recoil';
import { upsetConfigAtom } from './upsetConfigAtoms';

type PlotInformation = {
    description: string;
    sets: string;
    items: string;
}

export const plotInformationSelector = selector<PlotInformation>({
  key: 'meta-data',
  get: ({ get }) => get(upsetConfigAtom).plotInformation,
});
