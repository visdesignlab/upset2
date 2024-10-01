import { atom, selectorFamily } from 'recoil';

import { itemsAtom } from './itemsAtoms';

export const attributeAtom = atom<string[]>({
  key: 'attribute-columns',
  default: [],
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
