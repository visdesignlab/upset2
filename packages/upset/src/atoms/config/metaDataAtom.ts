import { selector } from 'recoil';
import { upsetConfigAtom } from './upsetConfigAtoms';

type MetaData = {
    description: string;
    sets: string;
    items: string;
}

export const metaDataSelector = selector<MetaData>({
  key: 'meta-data',
  get: ({ get }) => get(upsetConfigAtom).metaData,
});
