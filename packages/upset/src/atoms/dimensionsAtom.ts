import { atom, selector } from 'recoil';
import { calculateDimensions } from '../dimensions';
import { visibleAttributesSelector } from './config/visibleAttributes';
import { hiddenSetSelector, visibleSetSelector } from './config/visibleSetsAtoms';
import { displayedRowCountSelector, tallRowCountSelector } from './renderRowsAtom';

export const dimensionsSelector = selector<ReturnType<typeof calculateDimensions>>({
  key: 'dimensions',
  get: ({ get }) => {
    const visibleSets = get(visibleSetSelector);
    const rowCount = get(displayedRowCountSelector);
    const hiddenSets = get(hiddenSetSelector);
    const tallRowCount = get(tallRowCountSelector);
    let attributes = get(visibleAttributesSelector);

    const degree = attributes.includes('Degree');
    attributes = attributes.filter((a) => a !== 'Degree');

    return calculateDimensions(
      visibleSets.length,
      hiddenSets.length,
      rowCount,
      tallRowCount,
      attributes.length,
      degree,
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
