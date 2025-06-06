import { combinationsFromArray } from './combinations';
import { getSixNumberSummary, getId } from './process';
import {
  Aggregate,
  AggregateBy,
  Aggregates,
  Items,
  Row,
  Rows,
  SetMembershipStatus,
  Sets,
  Subsets,
  UNINCLUDED,
} from './types';
import {
  areRowsSubsets,
  getBelongingSetsFromSetMembership,
  getDegreeFromSetMembership,
  isRowSubset,
} from './typeutils';

/**
 * Retrieves all items from a given row.
 * If the row is a subset, it returns the items directly.
 * If the row is not a subset, it recursively retrieves the items from its subsets.
 * The returned items are unique (no duplicates).
 *
 * @param row - The row object from which to retrieve the items.
 * @returns An array of unique items from the row.
 */
export function getItems(row: Row) {
  if (isRowSubset(row)) {
    return row.items;
  }
  const items: string[] = [];

  row.items.order.forEach((subsetId) => {
    const element = row.items.values[subsetId];

    items.push(...getItems(element));
  });

  return Array.from(new Set(items));
}

/**
 * Updates the aggregate values with the attributes calculated from the items and attribute columns.
 * @param aggs - The aggregates object containing the order and values of the aggregates.
 * @param items - The items object containing the data items.
 * @param attributeColumns - The array of attribute columns to calculate the attributes from.
 */
function updateAggValues(aggs: Aggregates, items: Items, attributeColumns: string[]) {
  aggs.order.forEach((aggId) => {
    aggs.values[aggId].attributes = {
      ...getSixNumberSummary(items, getItems(aggs.values[aggId]), attributeColumns),
      deviation: aggs.values[aggId].attributes.deviation,
    };
  });
}

/**
 * Calculates the aggregate size of a row.
 * If the row is a subset, returns the size directly.
 * If the row contains items, recursively calculates the aggregate size of each item.
 * @param row - The row object to calculate the aggregate size for.
 * @returns The aggregate size of the row.
 */
export const getAggSize = (row: Row) => {
  if (isRowSubset(row)) {
    return row.size;
  }
  let size = 0;

  Object.values(row.items.values).forEach((r) => {
    size += getAggSize(r);
  });

  return size;
};

/**
 * Aggregates subsets by degree.
 *
 * @param subsets - The subsets to be aggregated.
 * @param level - The level of the aggregation.
 * @param items - The items to be aggregated.
 * @param attributeColumns - The attribute columns to be considered in the aggregation.
 * @param parentPrefix - The parent prefix for the aggregated subsets.
 * @returns The aggregated subsets.
 */
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
      aggregateBy: 'Degree',
      level,
      description: i === 0 ? 'in no set' : `${i} set intersection`,
      attributes: {
        deviation: 0,
      },
    };

    if (agg.level === 2) {
      agg.parent = parentPrefix.replace('-', '');
    }

    degreeMap[i] = id;
    aggs.values[id] = agg;
    aggs.order.push(id);
  }

  subsets.order.forEach((subsetId) => {
    let subset = subsets.values[subsetId];
    const degree = getDegreeFromSetMembership(subset.setMembership);

    const relevantAggregate = aggs.values[degreeMap[degree]];

    subset = { ...subset, parent: relevantAggregate.id };

    relevantAggregate.items.values[subsetId] = subset;
    relevantAggregate.items.order.push(subsetId);
    relevantAggregate.size += subset.size;
    relevantAggregate.attributes.deviation += subset.attributes.deviation;
  });

  updateAggValues(aggs, items, attributeColumns);

  return aggs;
}

/**
 * Aggregates subsets based on sets and other parameters.
 *
 * @param subsets - The subsets to be aggregated.
 * @param sets - The sets used for aggregation.
 * @param level - The level of aggregation.
 * @param items - The items to be aggregated.
 * @param attributeColumns - The attribute columns used for aggregation.
 * @param parentPrefix - The parent prefix used for aggregation.
 * @returns The aggregated subsets.
 */
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
      aggregateBy: 'Sets',
      level,
      description: elementName,
      attributes: {
        deviation: 0,
      },
    };

    if (agg.level === 2) {
      agg.parent = parentPrefix.replace('-', '');
    }

    setMap[set] = id;
    aggs.values[id] = agg;
    aggs.order.push(id);
  });

  subsets.order.forEach((subsetId) => {
    let subset = subsets.values[subsetId];

    const belongingSets = getBelongingSetsFromSetMembership(subset.setMembership);

    if (belongingSets.length === 0) {
      const relevantAggregate = aggs.values[setMap[UNINCLUDED]];

      subset = { ...subset, parent: relevantAggregate.id };

      relevantAggregate.items.values[subsetId] = subset;
      relevantAggregate.items.order.push(subsetId);
      relevantAggregate.size += subset.size;
      relevantAggregate.attributes.deviation += subset.attributes.deviation;
    }

    belongingSets.forEach((set) => {
      const relevantAggregate = aggs.values[setMap[set]];

      subset = { ...subset, parent: relevantAggregate.id };

      relevantAggregate.items.values[subsetId] = subset;
      relevantAggregate.items.order.push(subsetId);
      relevantAggregate.size += subset.size;
      relevantAggregate.attributes.deviation += subset.attributes.deviation;
    });
  });

  updateAggValues(aggs, items, attributeColumns);

  return aggs;
}

/**
 * Aggregates subsets by deviation.
 *
 * @param subsets - The subsets to be aggregated.
 * @param level - The level of the aggregation.
 * @param items - The items to be aggregated.
 * @param attributeColumns - The attribute columns to be considered.
 * @param parentPrefix - The parent prefix for the aggregation.
 * @returns The aggregated subsets.
 */
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
      aggregateBy: 'Deviations',
      level,
      attributes: {
        deviation: 0,
      },
    };

    if (agg.level === 2) {
      agg.parent = parentPrefix.replace('-', '');
    }

    deviationMap[type] = id;
    aggs.values[id] = agg;
    aggs.order.push(id);
  });

  subsets.order.forEach((subsetId) => {
    let subset = subsets.values[subsetId];
    const deviationType = subset.attributes.deviation >= 0 ? 'pos' : 'neg';

    const relevantAggregate = aggs.values[deviationMap[deviationType]];

    subset = { ...subset, parent: relevantAggregate.id };

    relevantAggregate.items.values[subsetId] = subset;
    relevantAggregate.items.order.push(subsetId);
    relevantAggregate.size += subset.size;
    relevantAggregate.attributes.deviation += subset.attributes.deviation;
  });

  updateAggValues(aggs, items, attributeColumns);

  return aggs;
}

/**
 * Aggregates subsets based on overlaps.
 *
 * @param subsets - The subsets to be aggregated.
 * @param sets - The sets associated with the subsets.
 * @param degree - The degree of overlap for aggregation.
 * @param level - The level of the aggregation.
 * @param items - The items associated with the subsets.
 * @param attributeColumns - The attribute columns to be considered for aggregation.
 * @param parentPrefix - The prefix for the parent identifier.
 * @returns The aggregated subsets.
 */
function aggregateByOverlaps(
  subsets: Subsets,
  sets: Sets,
  degree: number,
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
      level,
      description: setNames.join(' - '),
      attributes: {
        deviation: 0,
      },
    };

    if (agg.level === 2) {
      agg.parent = parentPrefix.replace('-', '');
    }

    overlapAggMap[combo] = id;
    aggs.values[id] = agg;
    aggs.order.push(id);
  });

  subsets.order.forEach((subsetId) => {
    let subset = subsets.values[subsetId];
    const belongingSets = getBelongingSetsFromSetMembership(subset.setMembership);
    const overlaps: string[] = combinationsFromArray(belongingSets, degree).map(
      (combo: string[]) => combo.sort().join(','),
    );

    overlaps.forEach((over) => {
      const relevantAggregate = aggs.values[overlapAggMap[over]];

      subset = { ...subset, parent: relevantAggregate.id };

      relevantAggregate.items.values[subsetId] = subset;
      relevantAggregate.items.order.push(subsetId);
      relevantAggregate.size += subset.size;
      relevantAggregate.attributes.deviation += subset.attributes.deviation;
    });
  });

  updateAggValues(aggs, items, attributeColumns);

  return aggs;
}

/**
 * Aggregates subsets based on the specified criteria.
 *
 * @param subsets - The subsets to be aggregated.
 * @param aggregateBy - The criteria to aggregate the subsets by.
 * @param overlapDegree - The degree of overlap to consider when aggregating by overlaps.
 * @param sets - The sets associated with the subsets.
 * @param items - The items associated with the subsets.
 * @param attributeColumns - The attribute columns to consider when aggregating by deviations.
 * @param level - The level of aggregation (default: 1).
 * @param parentPrefix - The parent prefix for the aggregated subsets (default: '').
 * @returns The aggregated subsets.
 */
function aggregateSubsets(
  subsets: Subsets,
  aggregateBy: AggregateBy,
  overlapDegree: number,
  sets: Sets,
  items: Items,
  attributeColumns: string[],
  level: number = 1,
  parentPrefix: string = '',
) {
  if (aggregateBy === 'Degree')
    return aggregateByDegree(subsets, level, items, attributeColumns, parentPrefix);
  if (aggregateBy === 'Sets')
    return aggregateBySets(subsets, sets, level, items, attributeColumns, parentPrefix);
  if (aggregateBy === 'Deviations')
    return aggregateByDeviation(subsets, level, items, attributeColumns, parentPrefix);
  if (aggregateBy === 'Overlaps') {
    return aggregateByOverlaps(
      subsets,
      sets,
      overlapDegree,
      level,
      items,
      attributeColumns,
      parentPrefix,
    );
  }
  return subsets;
}

/**
 * Performs the first aggregation step by calling the `aggregateSubsets` function.
 *
 * @param subsets - The subsets to be aggregated.
 * @param aggregateBy - The aggregation method to be used.
 * @param overlapDegree - The degree of overlap required for aggregation.
 * @param sets - The sets associated with the subsets.
 * @param items - The items associated with the subsets.
 * @param attributeColumns - The attribute columns to be considered during aggregation.
 * @returns The aggregated rows.
 */
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

/**
 * Performs a second level aggregation on the given aggregates.
 *
 * @param aggregates - The aggregates to be processed.
 * @param aggregateBy - The attribute to aggregate by.
 * @param overlapDegree - The degree of overlap required for aggregation.
 * @param sets - The sets data.
 * @param items - The items data.
 * @param attributeColumns - The attribute columns to consider.
 * @returns The aggregated result.
 */
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
        `${agg.id}-`,
      );
      // To add parent to nested aggs
      const newAgg = { ...agg, items: itms };
      aggs.values[aggId] = newAgg;
      aggs.order.push(aggId);
    }
  });

  return aggs;
}
