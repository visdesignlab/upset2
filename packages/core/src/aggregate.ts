import _ from 'lodash';
import 'lodash.combinations';

import { getIdGenerator } from './process';
import {
  getDegreeFromSetMembership,
  AggregateBy,
  areRowsSubsets,
  getBelongingSetsFromSetMembership,
  SetMembershipStatus,
  UNINCLUDED,
  Sets,
  Aggregate,
  Rows,
  Aggregates,
  Subsets,
} from './types';

function aggregateByDegree(subsets: Subsets, level: number) {
  if (subsets.order.length === 0) return subsets;

  const aggregateIdGen = getIdGenerator('Aggregate');

  const aggs: Aggregates = {
    values: {},
    order: [],
  };
  const degreeMap: { [key: string]: string } = {};

  const setList = Object.keys(subsets.values[subsets.order[0]].setMembership);

  for (let i = 0; i <= setList.length; ++i) {
    const id = aggregateIdGen();

    const agg: Aggregate = {
      id,
      elementName: `Degree ${i}`,
      items: {
        values: {},
        order: [],
      },
      size: 0,
      type: 'Aggregate',
      setMembership: {},
      deviation: 0,
      aggregateBy: 'Degree',
      level,
      description: i === 0 ? 'in no set' : `${i} set intersection`,
    };

    degreeMap[i] = id;
    aggs.values[id] = agg;
    aggs.order.push(id);
  }

  subsets.order.forEach((subsetId) => {
    const subset = subsets.values[subsetId];
    const degree = getDegreeFromSetMembership(subset.setMembership);

    const relevantAggregate = aggs.values[degreeMap[degree]];

    relevantAggregate.items.values[subsetId] = subset;
    relevantAggregate.items.order.push(subsetId);
    relevantAggregate.size += subset.size;
    relevantAggregate.deviation += subset.deviation;
  });

  return aggs;
}

function aggregateBySets(subsets: Subsets, sets: Sets, level: number) {
  if (subsets.order.length === 0) return subsets;

  const aggregateIdGen = getIdGenerator('Aggregate');

  const aggs: Aggregates = {
    values: {},
    order: [],
  };

  const setMap: { [k: string]: string } = {};
  const setList = Object.keys(subsets.values[subsets.order[0]].setMembership);

  const setMembership: { [key: string]: SetMembershipStatus } = {};
  const setMembershipNone: { [key: string]: SetMembershipStatus } = {};

  setList.forEach((d) => {
    setMembership[d] = 'May';
    setMembershipNone[d] = 'No';
  });

  setList.unshift(UNINCLUDED);

  setList.forEach((set) => {
    const elementName = sets[set]?.elementName || 'No Set';
    const id = aggregateIdGen();

    const agg: Aggregate = {
      id,
      elementName,
      items: {
        values: {},
        order: [],
      },
      size: 0,
      type: 'Aggregate',
      setMembership:
        set === UNINCLUDED
          ? { ...setMembershipNone }
          : { ...setMembership, [set]: 'Yes' },
      deviation: 0,
      aggregateBy: 'Sets',
      level,
      description: elementName,
    };

    setMap[set] = id;
    aggs.values[id] = agg;
    aggs.order.push(id);
  });

  subsets.order.forEach((subsetId) => {
    const subset = subsets.values[subsetId];

    const belongingSets = getBelongingSetsFromSetMembership(
      subset.setMembership,
    );

    if (belongingSets.length === 0) {
      const relevantAggregate = aggs.values[setMap[UNINCLUDED]];

      relevantAggregate.items.values[subsetId] = subset;
      relevantAggregate.items.order.push(subsetId);
      relevantAggregate.size += subset.size;
      relevantAggregate.deviation += subset.deviation;
    }

    belongingSets.forEach((set) => {
      const relevantAggregate = aggs.values[setMap[set]];

      relevantAggregate.items.values[subsetId] = subset;
      relevantAggregate.items.order.push(subsetId);
      relevantAggregate.size += subset.size;
      relevantAggregate.deviation += subset.deviation;
    });
  });

  return aggs;
}

function aggregateByDeviation(subsets: Subsets, level: number) {
  if (subsets.order.length === 0) return subsets;

  const aggregateIdGen = getIdGenerator('Aggregate');

  const aggs: Aggregates = {
    values: {},
    order: [],
  };

  const deviationMap: { [key: string]: string } = {};
  const deviationTypes = {
    pos: {
      elementName: 'Positive',
      description: 'Positive Expected Value',
    },
    neg: {
      elementName: 'Negative',
      description: 'Negative Expected Value',
    },
  };

  Object.entries(deviationTypes).forEach(([type, val]) => {
    const id = aggregateIdGen();
    const { elementName, description } = val;

    const agg: Aggregate = {
      id,
      elementName,
      description,
      items: {
        values: {},
        order: [],
      },
      size: 0,
      type: 'Aggregate',
      setMembership: {},
      deviation: 0,
      aggregateBy: 'Deviations',
      level,
    };

    deviationMap[type] = id;
    aggs.values[id] = agg;
    aggs.order.push(id);
  });

  subsets.order.forEach((subsetId) => {
    const subset = subsets.values[subsetId];
    const deviationType = subset.deviation >= 0 ? 'pos' : 'neg';

    const relevantAggregate = aggs.values[deviationMap[deviationType]];

    relevantAggregate.items.values[subsetId] = subset;
    relevantAggregate.items.order.push(subsetId);
    relevantAggregate.size += subset.size;
    relevantAggregate.deviation += subset.deviation;
  });

  return aggs;
}

function aggregateByOverlaps(
  subsets: Subsets,
  sets: Sets,
  degree: number,
  level: number,
) {
  if (subsets.order.length === 0) return subsets;
  const aggregateIdGen = getIdGenerator('Aggregate');

  const aggs: Aggregates = {
    values: {},
    order: [],
  };

  const setMembership: { [key: string]: SetMembershipStatus } = {};

  const setList = Object.keys(subsets.values[subsets.order[0]].setMembership);
  const combinations: string[] = (_ as any)
    .combinations(setList, degree)
    .map((combo: string[]) => combo.sort().join(','));

  const overlapAggMap: { [key: string]: string } = {};

  setList.forEach((d) => {
    setMembership[d] = 'May';
  });

  combinations.forEach((combo) => {
    const id = aggregateIdGen();
    const comboSets = combo.split(',');
    const setNames = comboSets.map((set) => sets[set].elementName);

    const sm = { ...setMembership };
    comboSets.forEach((s) => {
      sm[s] = 'Yes';
    });

    const agg: Aggregate = {
      id,
      elementName: setNames.join(' - '),
      items: {
        values: {},
        order: [],
      },
      size: 0,
      type: 'Aggregate',
      aggregateBy: 'Overlaps',
      setMembership: sm,
      deviation: 0,
      level,
      description: setNames.join(' - '),
    };

    overlapAggMap[combo] = id;
    aggs.values[id] = agg;
    aggs.order.push(id);
  });

  subsets.order.forEach((subsetId) => {
    const subset = subsets.values[subsetId];
    const belongingSets = getBelongingSetsFromSetMembership(
      subset.setMembership,
    );
    const overlaps: string[] = (_ as any)
      .combinations(belongingSets, degree)
      .map((combo: string[]) => combo.sort().join(','));

    overlaps.forEach((over) => {
      const relevantAgg = aggs.values[overlapAggMap[over]];

      relevantAgg.items.values[subsetId] = subset;
      relevantAgg.items.order.push(subsetId);
      relevantAgg.size += subset.size;
      relevantAgg.deviation += subset.deviation;
    });
  });

  return aggs;
}

function aggregateSubsets(
  subsets: Subsets,
  aggregateBy: AggregateBy,
  overlapDegree: number,
  sets: Sets,
  level: number = 1,
) {
  if (aggregateBy === 'Degree') return aggregateByDegree(subsets, level);
  if (aggregateBy === 'Sets') return aggregateBySets(subsets, sets, level);
  if (aggregateBy === 'Deviations') return aggregateByDeviation(subsets, level);
  if (aggregateBy === 'Overlaps')
    return aggregateByOverlaps(subsets, sets, overlapDegree, level);
  return subsets;
}

export function firstAggregation(
  subsets: Subsets,
  aggregateBy: AggregateBy,
  overlapDegree: number,
  sets: Sets,
): Rows {
  return aggregateSubsets(subsets, aggregateBy, overlapDegree, sets);
}

export function secondAggregation(
  aggregates: Aggregates,
  aggregateBy: AggregateBy,
  overlapDegree: number,
  sets: Sets,
) {
  const aggs: Aggregates = {
    values: {},
    order: [],
  };

  aggregates.order.forEach((aggId: string) => {
    const agg = aggregates.values[aggId];
    if (areRowsSubsets(agg.items)) {
      const items = aggregateSubsets(
        agg.items,
        aggregateBy,
        overlapDegree,
        sets,
        2,
      );
      const newAgg = { ...agg, items };
      aggs.values[aggId] = newAgg;
      aggs.order.push(aggId);
    }
  });

  return aggs;
}
