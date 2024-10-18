import { getRows, Item, Rows } from "@visdesignlab/upset2-core";
import { selector, selectorFamily } from "recoil";
import { dataSelector } from "./dataAtom";
import { configAtom } from "./configAtoms";

/**
 * Gets all rows in the plot
 */
export const rowsSelector = selector<Rows>({
  key: 'plot-rows',
  get: ({ get }) => getRows(get(dataSelector), get(configAtom)),
})

/**
 * Gets all items from the CoreUpsetData
 */
export const itemsSelector = selector<Item[]>({
  key: 'data-items',
  get: ({ get }) => Object.values(get(dataSelector)?.items ?? {}),
})

/**
 * Counts the number of items that have a given attribute.
 * null, undefined, NaN, and '' values are not counted.
 * @param {string} att Attribute name to count items for
 * @returns {number} Count of items that have a truthy value for this attribute
 */
export const attributeValuesCount = selectorFamily<number, string>({
  key: 'attribute-count',
  get: (att: string) => ({ get }) => Object.values(
    get(itemsSelector),
  ).filter(
    (item) => !!item[att],
  ).length,
});

/**
 * Selector to count values for multiple attributes
 * @param {string[]} atts Array of attribute names to count values for
 * @returns {Record<string, number>} An object where keys are attribute names and values are their respective counts
 */
export const countValuesForAttributes = selectorFamily<Record<string, number>, string[]>({
  key: 'multi-att-count',
  get: (atts: string[]) => ({ get }) => {
    const counts: Record<string, number> = {};
    atts.forEach((att) => {
      counts[att] = get(attributeValuesCount(att));
    });
    return counts;
  },
});