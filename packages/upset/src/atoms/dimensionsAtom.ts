import { atom, selector } from 'recoil';
import { calculateDimensions } from '../dimensions';
import { visibleAttributesSelector } from './config/visibleAttributes';
import { hiddenSetSelector, visibleSetSelector } from './config/visibleSetsAtoms';
import { rowCountSelector } from './renderRowsAtom';

export const dimensionsSelector = selector<
ReturnType<typeof calculateDimensions>
>({
  key: 'dimensions',
  get: ({ get }) => {
    const visibleSets = get(visibleSetSelector);
    const rowCount = get(rowCountSelector);
    const hiddenSets = get(hiddenSetSelector);
    const attributes = get(visibleAttributesSelector);

    return calculateDimensions(
      visibleSets.length,
      hiddenSets.length,
      rowCount,
      attributes.length,
    );
  },
});

/**
 * The spacing height necessary to prevent Upset sidebars from overlapping the footer in px.
 * This is some multiple of the footer height provided to the Upset component;
 * I don't know why it has to be multiplied but it does.
 * @default 'auto'
 */
export const footerHeightAtom = atom<number>({
  key: 'footerHeight',
  default: 0,
});
