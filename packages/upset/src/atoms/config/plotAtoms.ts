import { selector } from 'recoil';

import { upsetConfigAtom } from './upsetConfigAtoms';

const plotsMapSelector = selector({
  key: 'added-plots',
  get: ({ get }) => get(upsetConfigAtom).plots,
});

export const scatterplotsSelector = selector({
  key: 'scatterplots',
  get: ({ get }) => get(plotsMapSelector).scatterplots,
});

export const histogramSelector = selector({
  key: 'histogram',
  get: ({ get }) => get(plotsMapSelector).histograms,
});

export const plotsSelector = selector({
  key: 'all-plots',
  get: ({ get }) => [
    ...get(scatterplotsSelector),
    ...get(histogramSelector),
  ],
});
