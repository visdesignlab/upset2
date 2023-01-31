import { combinationsFromArray } from './combinations';
import { getFiveNumberSummary, getId } from './process';
import {
  Aggregate,
  AggregateBy,
  Aggregates,
  areRowsSubsets,
  getBelongingSetsFromSetMembership,
  getDegreeFromSetMembership,
  isRowSubset,
  Items,
  Row,
  Rows,
  SetMembershipStatus,
  Sets,
  Subsets,
  UNINCLUDED,
} from './types';

export function getItems(row: Row) {
  if (isRowSubset(row)) {
    return row.items;
  } else {
    const items: string[] = [];

    row.items.order.forEach((subsetId) => {
      const element = row.items.values[subsetId];

      items.push(...getItems(element));
    });

    return Array.from(new Set(items));
  }
}

function aggregateByDegree(
  subsets: Subsets,
  level: number,
  items: Items,
  attributeColumns: string[],
  parentPrefix: string,
) {
  if (subsets.order.length === 0) return subsets;

  const aggs: Aggregates = {
    values: {},
    order: [],
  };
  const degreeMap: { [key: string]: string } = {};

  const setList = Object.keys(subsets.values[subsets.order[0]].setMembership);

  for (let i = 0; i <= setList.length; ++i) {
    const id = getId(`${parentPrefix}Agg`, `Degree ${i}`);

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
      attributes: {},
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

  aggs.order.forEach((aggId) => {
    aggs.values[aggId].attributes = getFiveNumberSummary(
      items,
      getItems(aggs.values[aggId]),
      attributeColumns,
    );
  });

  return aggs;
}

function aggregateBySets(
  subsets: Subsets,
  sets: Sets,
  level: number,
  items: Items,
  attributeColumns: string[],
  parentPrefix: string,
) {
  if (subsets.order.length === 0) return subsets;

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
    const id = getId(`${parentPrefix}Agg`, elementName);

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
      attributes: {},
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

  aggs.order.forEach((aggId) => {
    aggs.values[aggId].attributes = getFiveNumberSummary(
      items,
      getItems(aggs.values[aggId]),
      attributeColumns,
    );
  });

  return aggs;
}

function aggregateByDeviation(
  subsets: Subsets,
  level: number,
  items: Items,
  attributeColumns: string[],
  parentPrefix: string,
) {
  if (subsets.order.length === 0) return subsets;

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
    const { elementName, description } = val;

    const id = getId(`${parentPrefix}Agg`, elementName);

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
      attributes: {},
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

  aggs.order.forEach((aggId) => {
    aggs.values[aggId].attributes = getFiveNumberSummary(
      items,
      getItems(aggs.values[aggId]),
      attributeColumns,
    );
  });

  return aggs;
}

function aggregateByOverlaps(
  subsets: Subsets,
  sets: Sets,
  degree: number,
  level: number,
  items: Items,
  attributeColumns: string[],
  parentPrefix : string,
) {
  if (subsets.order.length === 0) return subsets;

  const aggs: Aggregates = {
    values: {},
    order: [],
  };

  const setMembership: { [key: string]: SetMembershipStatus } = {};

  const setList = Object.keys(subsets.values[subsets.order[0]].setMembership);
  const combinations: string[] = combinationsFromArray(setList, degree).map(
    (combo: string[]) => combo.sort().join(','),
  );

  const overlapAggMap: { [key: string]: string } = {};

  setList.forEach((d) => {
    setMembership[d] = 'May';
  });

  combinations.forEach((combo) => {
    const comboSets = combo.split(',');
    const setNames = comboSets.map((set) => sets[set].elementName);
    const elementName = setNames.join(' - ');

    const id = getId(`${parentPrefix}Agg`, elementName);
    const sm = { ...setMembership };
    comboSets.forEach((s) => {
      sm[s] = 'Yes';
    });

    const agg: Aggregate = {
      id,
      elementName,
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
      attributes: {},
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
    const overlaps: string[] = combinationsFromArray(belongingSets, degree).map(
      (combo: string[]) => combo.sort().join(','),
    );

    overlaps.forEach((over) => {
      const relevantAgg = aggs.values[overlapAggMap[over]];

      relevantAgg.items.values[subsetId] = subset;
      relevantAgg.items.order.push(subsetId);
      relevantAgg.size += subset.size;
      relevantAgg.deviation += subset.deviation;
    });
  });

  aggs.order.forEach((aggId) => {
    aggs.values[aggId].attributes = getFiveNumberSummary(
      items,
      getItems(aggs.values[aggId]),
      attributeColumns,
    );
  });

  return aggs;
}

function aggregateSubsets(
  subsets: Subsets,
  aggregateBy: AggregateBy,
  overlapDegree: number,
  sets: Sets,
  items: Items,
  attributeColumns: string[],
  level: number = 1,
  parentPrefix : string = ""
) {
  if (aggregateBy === 'Degree')
    return aggregateByDegree(subsets, level, items, attributeColumns, parentPrefix);
  if (aggregateBy === 'Sets')
    return aggregateBySets(subsets, sets, level, items, attributeColumns, parentPrefix);
  if (aggregateBy === 'Deviations')
    return aggregateByDeviation(subsets, level, items, attributeColumns, parentPrefix);
  if (aggregateBy === 'Overlaps')
    return aggregateByOverlaps(
      subsets,
      sets,
      overlapDegree,
      level,
      items,
      attributeColumns,
      parentPrefix
    );
  return subsets;
}

export function firstAggregation(
  subsets: Subsets,
  aggregateBy: AggregateBy,
  overlapDegree: number,
  sets: Sets,
  items: Items,
  attributeColumns: string[],
): Rows {
  return aggregateSubsets(
    subsets,
    aggregateBy,
    overlapDegree,
    sets,
    items,
    attributeColumns,
  );
}

export function secondAggregation(
  aggregates: Aggregates,
  aggregateBy: AggregateBy,
  overlapDegree: number,
  sets: Sets,
  items: Items,
  attributeColumns: string[],
) {
  const aggs: Aggregates = {
    values: {},
    order: [],
  };

  aggregates.order.forEach((aggId: string) => {
    const agg = aggregates.values[aggId];
    if (areRowsSubsets(agg.items)) {
      const itms = aggregateSubsets(
        agg.items,
        aggregateBy,
        overlapDegree,
        sets,
        items,
        attributeColumns,
        2,
        agg.id
      );
      const newAgg = { ...agg, items: itms };
      aggs.values[aggId] = newAgg;
      aggs.order.push(aggId);
    }
  });

  return aggs;
}
