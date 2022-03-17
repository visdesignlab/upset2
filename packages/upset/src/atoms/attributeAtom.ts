import { atom, selectorFamily } from 'recoil';

import { itemsAtom } from './itemsAtoms';

export const attributeAtom = atom<string[]>({
  key: 'attribute-columns',
  default: [],
});

export const attributeValuesSelector = selectorFamily<number[], string>({
  key: 'attributeValueSelectorFamily',
  get:
    (attribute: string) =>
    ({ get }) => {
      const items = get(itemsAtom);
      const values = Object.values(items).map(
        (val) => val[attribute] as number,
      );
      return values;
    },
});

export const attributeMinMaxSelector = selectorFamily<
  { min: number; max: number },
  string
>({
  key: 'attributeMinMaxSelector',
  get:
    (attribute: string) =>
    ({ get }) => {
      const values = get(attributeValuesSelector(attribute));
      return {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    },
});
