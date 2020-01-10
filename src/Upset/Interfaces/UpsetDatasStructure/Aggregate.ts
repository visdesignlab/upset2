import { BaseElement, createBaseElement } from './BaseElement';
import { Subsets, Subset } from './Subset';
import deepCopy from '../../Utils/deepCopy';

export interface Aggregate extends BaseElement {
  disproportionality: number;
  expectedProbability: number;
  level: number;
  subsets: Subsets;
}

export function createAggregate(id: string, name: string, level: number): Aggregate {
  const base = createBaseElement(id, name);

  return {
    ...base,
    type: 'Aggregate',
    subsets: [],
    level,
    expectedProbability: 0,
    disproportionality: 0
  };
}

export function addSubsetToAggregate(agg: Aggregate, subset: Subset): Aggregate {
  const aggregate = deepCopy(agg);
  aggregate.subsets.push(subset);

  aggregate.items = [...aggregate.items, ...subset.items];
  aggregate.size = aggregate.items.length;
  aggregate.expectedProbability += subset.expectedProbability;
  aggregate.disproportionality += subset.disproportionality;

  return aggregate;
}
