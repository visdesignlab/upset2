import { selector } from 'recoil';
import { upsetConfigAtom } from './config/upsetConfigAtoms';

export const collapsedSelector = selector<string[]>({
  key: 'collapsed-selector',
  get: ({ get }) => {
    const collapsed = get(upsetConfigAtom).collapsed;
    return collapsed;
  }
});