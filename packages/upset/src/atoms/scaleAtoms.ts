import { scaleLinear } from 'd3';
import { selector } from 'recoil';

import { maxDeviationSelector } from './maxAtoms';

export const deviationScaleAtom = selector({
  key: 'deviation-scale',
  get: ({ get }) => {
    const maxDeviation = get(maxDeviationSelector);

    return scaleLinear().domain([-maxDeviation, maxDeviation]).nice();
  },
});
