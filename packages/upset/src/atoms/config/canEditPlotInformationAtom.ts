import { atom } from 'recoil';

export const canEditPlotInformationAtom = atom<boolean>({
  key: 'canEditPlotInformationAtom',
  default: false,
});
