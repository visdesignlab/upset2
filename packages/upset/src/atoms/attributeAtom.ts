import { atom, selectorFamily } from 'recoil';

import { itemsAtom } from './itemsAtoms';

export const attributeAtom = atom<string[]>({
  key: 'attribute-columns',
  default: [],
});

export const attributeValuesSelector = selectorFamily<number[], string>({
  key: 'attribute-values',
  get:
    (attribute: string) => ({ get }) => {
      const items = get(itemsAtom);
      const values = Object.values(items).map(
        (val) => {
          const retVal = val[attribute] as number;
          return Number.isNaN(retVal) ? 0 : retVal;
        },
      );

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
      if (values.includes(NaN)) {
        return {
          min: 0,
          max: 0,
        };
      }

      return {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    },
});
