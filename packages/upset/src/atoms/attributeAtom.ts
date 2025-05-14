import { atom, selector, selectorFamily } from 'recoil';
import { ColumnTypes } from '@visdesignlab/upset2-core';
import { itemsAtom } from './itemsAtoms';
import { dataAtom } from './dataAtom';
import { rowItemsSelector } from './elementsSelectors';
import { categoryColorPalette, extraCategoryColors } from '../utils/styles';
import { rowsSelector } from './renderRowsAtom';

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

/**
 * @param {string} attribute Attribute name
 * @returns the maximum number of items with the given categorical attribute in a single row.
 * Specifically: items don't have to have a value for a categorical attribute, so rows can have fewer
 * items in a category than the number of items in the row. This selector returns the largest row for this categorical
 * attribute; this is equivalent to the size of the biggest stacked bar displayed for this attribute.
 */
export const maxCategorySizeSelector = selectorFamily<number, string>({
  key: 'max-categorical-count',
  get:
    (attribute) => ({ get }) => {
      const rows = get(rowsSelector);
      return Object.values(rows).reduce((max, row) => {
        const count = get(categoricalCountSelector({ row: row.id, attribute }));
        return Math.max(max, Object.values(count).reduce((a, b) => a + b, 0));
      }, 0);
    },
});

/**
 * Returns a given number of colors to display categorical data in stacked bar charts
 * @param {number} count Number of colors to return
 * @returns {string[]} Array of colors in hex format
 */
export const categoricalColorSelector = selectorFamily<string[], number>({
  key: 'categorical-color',
  get: (count) => () => {
    if (count < categoryColorPalette.length) {
      return categoryColorPalette.slice(0, count);
    }

    const colors = categoryColorPalette;
    let alternate = false;
    for (let i = categoryColorPalette.length; i < count; i++) {
      colors.push(extraCategoryColors[alternate ? 1 : 0]);
      alternate = !alternate;
    }
    return colors;
  },
});

/**
 * @returns the minimum and maximum values for a given attribute
 * @param {string} attribute Attribute name
 * Used for numeric and categorical attributes to set the scale of the axis in the attribute column header
 */
export const attributeMinMaxSelector = selectorFamily<
  { min: number; max: number },
  string
>({
  key: 'attribute-min-max',
  get:
    (attribute: string) => ({ get }) => {
      const attTypes = get(attTypesSelector);
      const maxSize = get(maxCategorySizeSelector(attribute));
      const values = get(attributeValuesSelector(attribute));

      if (attTypes[attribute] === 'category') return { min: 0, max: maxSize };
      return {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    },
});
