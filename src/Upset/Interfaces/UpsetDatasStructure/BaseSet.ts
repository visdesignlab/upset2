import { createBaseElement, BaseElement } from './BaseElement';

export interface BaseSet extends BaseElement {
  combinedSets: number[];
  noCombinedSets: number;
  itemMembership: number[];
  depth: number;
}

export function createBaseSet(
  id: string,
  setName: string,
  combinedSets: number[],
  data: number[],
  depth: number = 0
): BaseSet {
  const base = createBaseElement(id, setName);
  let noCombinedSets = 0;

  combinedSets.forEach(set => {
    if (set !== 0) {
      noCombinedSets++;
    }
  });

  base.itemMembership = [...data];

  data.forEach((d, i) => {
    if (d !== 0) {
      base.items.push(i);
    }
  });
  base.size = base.items.length;
  base.dataRatio = base.size / depth;

  return {
    ...base,
    combinedSets,
    noCombinedSets,
    depth
  };
}
