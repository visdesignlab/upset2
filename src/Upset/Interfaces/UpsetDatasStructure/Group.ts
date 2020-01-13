import { BaseElement, createBaseElement } from './BaseElement';
import { Aggregate, createAggregate, addSubsetToAggregate } from './Aggregate';
import { Subsets, Subset } from './Subset';
import { AggregationOptions } from '../AggregationOptions';
import deepCopy from '../../Utils/deepCopy';

export type Groups = Group[];

export interface Group extends BaseElement {
  aggregate: Aggregate;
  disproportionalitySum: number;
  disproportionality: number;
  expectedProbability: number;
  hiddenSets: Subsets;
  visibleSets: Subsets;
  subsets: Subsets;
  level: number;
  nestedGroups: Groups;
  aggregatedBy: AggregationOptions;
  setMembership?: number[];
}

export function createGroup(
  id: string,
  name: string,
  level: number,
  aggregatedBy: AggregationOptions,
  setMembership?: number[]
): Group {
  const base = createBaseElement(id, name);
  base.type = 'Group';

  const aggregate = createAggregate(`empty${id}`, 'Subsets', level + 1);

  return {
    ...base,
    nestedGroups: [],
    level,
    subsets: [],
    visibleSets: [],
    aggregate,
    aggregatedBy,
    hiddenSets: [],
    expectedProbability: 0,
    disproportionality: 0,
    disproportionalitySum: 0,
    setMembership
  };
}

export function addSubsetToGroup(gr: Group, subset: Subset): Group {
  const group = deepCopy(gr);

  group.subsets.push(subset);

  if (subset.size > 0) {
    group.visibleSets.unshift(subset);
  } else {
    group.hiddenSets.unshift(subset);
    group.aggregate = addSubsetToAggregate(group.aggregate, subset);
  }

  group.items = [...group.items, ...subset.items];

  group.size = group.items.length;
  group.expectedProbability += subset.expectedProbability;
  group.disproportionality += subset.disproportionality;

  return group;
}

export function addGroupToGroup(baseGroup: Group, groupToAdd: Group): Group {
  const group = deepCopy(baseGroup);

  group.nestedGroups.push(groupToAdd);
  group.hiddenSets = [...group.hiddenSets, ...groupToAdd.hiddenSets];
  group.visibleSets = [...group.visibleSets, ...groupToAdd.visibleSets];

  groupToAdd.subsets.forEach(set => {
    group.aggregate = addSubsetToAggregate(group.aggregate, set);
  });

  return group;
}
