import { atom, selector, selectorFamily } from 'recoil';

import { ColumnTypes } from '@visdesignlab/upset2-core';
import { itemsAtom } from './itemsAtoms';
import { dataAtom } from './dataAtom';

/**
 * All attributes, including degree and deviation
 */
export const attributeAtom = atom<string[]>({
  key: 'attribute-columns',
  default: [],
});

/**
 * Types of all attributes
 * @returns {ColumnTypes} Object with attribute names as keys and their types as values
 */
export const attTypesSelector = selector<ColumnTypes>({
  key: 'attribute-types',
  get: ({ get }) => get(dataAtom).columnTypes,
});

/**
 * All attribute columns except Degree and Deviation
 */
export const dataAttributeSelector = selector<string[]>({
  key: 'data-attribute-columns',
  get: ({ get }) => {
    const atts = get(attributeAtom);
    return atts.filter((att) => att !== 'Degree' && att !== 'Deviation');
  },
});

/**
 * Gets all non-NaN values for a given attribute
 * @param {string} attribute Attribute name
 * @returns {number[]} All numeric (!Number.isNaN) values for this attribute
 */
export const attributeValuesSelector = selectorFamily<number[], string>({
  key: 'attribute-values',
  get:
    (attribute: string) => ({ get }) => {
      const items = get(itemsAtom);
      const values = Object.values(items)
        .map((item) => item[attribute] as number)
        .filter((val) => !Number.isNaN(val));

      return values;
    },
});

export const attributeMinMaxSelector = selectorFamily<
  { min: number; max: number },
  string
>({
  key: 'attribute-min-max',
  get:
    (attribute: string) => ({ get }) => {
      const values = get(attributeValuesSelector(attribute));

      return {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    },
});
