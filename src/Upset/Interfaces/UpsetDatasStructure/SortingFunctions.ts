import { Elements, Data } from './Data';
import { AggregationOptions } from '../AggregationOptions';
import { SortingOptions } from '../SortOptions';
import { Subset, Subsets } from './Subset';
import { Sets } from './Set';
import { Group, Groups } from './Group';

export function sortWithoutAggregation(
  inputData: Elements,
  sortBy: SortingOptions,
  sortBySetName: string = 'None',
  originalData?: Data
) {
  let data = [...inputData];
  if (sortBy === 'Cardinality') {
    data = sortByCardinality(data);
  } else if (sortBy === 'Deviation') {
    data = sortByDeviation(data);
  } else if (sortBy === 'Degree') {
    data = sortByDegree(data);
  } else if (sortBy === 'Set') {
    const { usedSets } = originalData!;
    data = sortBySet(data as Subsets, usedSets, sortBySetName);
  }
  return data;
}

export function sortOnlyFirstAggregation(inputData: Groups, sortBy: SortingOptions) {
  let data = [...inputData];

  data = sortWithoutAggregation(data, sortBy) as Groups;
  data.forEach(group => {
    group.subsets = sortWithoutAggregation(group.subsets, sortBy) as Subsets;
  });

  return data;
}

function sortBySet(data: Subsets, sets: Sets, setName: string): Elements {
  const usedSetsName = sets.map(d => d.elementName);
  const idx = usedSetsName.findIndex(s => s === setName);

  return data.sort((a, b) => {
    return b.combinedSets[idx] - a.combinedSets[idx];
  });
}

function sortByDegree(data: Elements): Elements {
  return data.sort((a, b) => (a as Subset).noCombinedSets - (b as Subset).noCombinedSets);
}

function sortByCardinality(data: Elements) {
  return data.sort((a, b) => b.size - a.size);
}

function sortByDeviation(data: Elements): Elements {
  const d: (Subset | Group)[] = data as any;
  return d.sort((a, b) => b.disproportionality - a.disproportionality);
}
