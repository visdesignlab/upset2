import { atom, selector, selectorFamily } from 'recoil';
import { ColumnTypes } from '@visdesignlab/upset2-core';
import { itemsAtom } from './itemsAtoms';
import { dataAtom } from './dataAtom';
import { rowItemsSelector } from './elementsSelectors';

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

/**
 * Counts the number of items in each category for a given attribute and row
 * @param {string} row Row ID
 * @param {string} attribute Attribute name
 * @returns {Object} Object with category names as keys and their counts as values
 */
export const categoricalCountSelector = selectorFamily<
  { [key: string]: number },
  { row: string; attribute: string }
>({
  key: 'categorical-count',
  get:
    ({ row, attribute }) => ({ get }) => {
      const items = get(rowItemsSelector(row));

      const result: { [key: string]: number } = {};
      items.forEach((item) => {
        if (typeof item[attribute] !== 'string' || !item[attribute]) return;
        const value = item[attribute];
        if (value in result) result[value] += 1;
        else result[value] = 1;
      });
      return result;
    },
});
