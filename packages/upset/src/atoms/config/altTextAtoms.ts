import { selector } from 'recoil';
import { upsetConfigAtom } from './upsetConfigAtoms';

type AltText = {
    verbosity: string;
    explain: string;
}

export const altTextSelector = selector<AltText>({
  key: 'alt-text',
  get: ({ get }) => get(upsetConfigAtom).altText,
});
