import { selector } from 'recoil';
import { calculateDimensions } from '../dimensions';
import { rowsCountSelector } from './renderRowsAtom';
import { visibleSetsAtom } from './setsAtoms';

export const dimensionsSelector = selector<
  ReturnType<typeof calculateDimensions>
>({
  key: 'dimensions',
  get: ({ get }) => {
    const visibleSets = get(visibleSetsAtom);
    const rowCount = get(rowsCountSelector);

    return calculateDimensions(visibleSets.length, rowCount);
  },
});
