import { Set, createSet } from './Set';

export interface Subset extends Set {
  expectedProbability: number;
  disproportionality: number;
}

export type Subsets = Subset[];

export function createSubset(
  id: string,
  setName: string,
  combinedSets: number[],
  data: number[],
  expectedProb: number,
  depth: number
): Subset {
  const base = createSet(id, setName, combinedSets, data, depth);

  let [expectedProbability, disproportionality] = [expectedProb, 0];

  let observedProb = (base.size * 1.0) / base.depth;
  disproportionality = observedProb - expectedProb;
  base.type = 'Subset';

  return {
    ...base,
    expectedProbability,
    disproportionality
  };
}
