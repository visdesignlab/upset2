import { selector } from 'recoil';
import { calculateDimensions } from '../dimensions';
import { renderRowsCountSelector } from './renderRowsAtom';
import { visibleSetsAtom } from './setsAtoms';

export const dimensionsSelector = selector<
  ReturnType<typeof calculateDimensions>
>({
  key: 'dimensions',
  get: ({ get }) => {
    const visibleSets = get(visibleSetsAtom);
    const rowCount = get(renderRowsCountSelector);

    return calculateDimensions(visibleSets.length, rowCount);
  },
});
