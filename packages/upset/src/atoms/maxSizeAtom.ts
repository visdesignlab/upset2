import { atom, selector } from 'recoil';
import { rowsSelector } from './renderRowsAtom';

/**
 * Max intersection size bar size; used to set the size scale
 * Either calculated automatically or manually set by the advanced scale slider
 */
export const maxSize = atom({
  key: 'max-size',
  default: -1,
});

/**
 * @returns The size of the largest subset/row in the matrix
 * This ignores the advanced size scale slider
 */
export const maxRowSizeSelector = selector<number>({
  key: 'max-subset-size',
  get: ({ get }) =>
    Math.max(...Object.values(get(rowsSelector)).map((subset) => subset.size)),
});
