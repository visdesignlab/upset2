import { Sets, Set, createSet } from './Set';
import { BaseSet } from './BaseSet';
import { BaseElement } from './BaseElement';
import { Subsets, createSubset } from './Subset';
import { Attributes, Attribute } from './Attribute';
import { DatasetInfo } from '../DatasetInfo';
import { dsv, DSVParsedArray, DSVRowString } from 'd3';
import { SortingOptions } from '../SortOptions';
import { Group, Groups } from './Group';
import { AggregationOptions } from '../AggregationOptions';
import { sortWithoutAggregation, sortOnlyFirstAggregation } from './SortingFunctions';
import { applyFirstAggregation, SetNameDictionary } from './AggregationFunctions';

export type Element = Set | BaseSet | BaseElement | Group;
export type Elements = Element[];

export type ElementType = 'Set' | 'BaseSet' | 'BaseElement' | 'Group';

export type RenderRow = {
  id: string;
  element: Element;
};

type RawData = {
  rawSets: number[][];
  setNames: string[];
  header: string[];
};

export type Membership = { [key: string]: string[] };

export type RenderRows = RenderRow[];

const numericAttributeType = ['integer', 'float'];

export interface Data {
  info: DatasetInfo;
  sets: Sets;
  usedSets: Sets;
  subsets: Subsets;
  calculatedAttributes: Attributes;
  attributes: Attributes;
  selectedAttributes: Attributes;
  unSelectedAttributes: Attributes;
  labelAttribute: Attribute;
  combinations: number;
  items: any[];
  depth: number;
  noDefaultSets: number;
  unusedSets: Sets;
  membership: Membership;
  dataset: DSVParsedArray<DSVRowString>;
}

async function createData(
  info: DatasetInfo,
  noDefaultSets: number = 6,
  noSelectedAttributes: number = 2
): Promise<Data> {
  const usedSets: Sets = [];
  const selectedAttributes: Attributes = [];
  const unSelectedAttributes: Attributes = [];
  const unusedSets: Sets = [];

  const data = await dsv(info.separator, `${info.file}?alt=media`);

  const { rawData, items, depth } = getRawData(data, info);

  const { sets } = getSets(rawData, depth);

  sets.forEach((s, i) => {
    if (i < noDefaultSets) {
      usedSets.push(s);
    } else {
      unusedSets.push(s);
    }
  });

  const { attributes, calculatedAttributes } = getAttributes(data, sets, info, rawData, depth);

  const numbericAttributes = attributes.filter(d => numericAttributeType.includes(d.type));

  numbericAttributes.forEach((attr, i) => {
    if (i < noSelectedAttributes) {
      selectedAttributes.push(attr);
    } else {
      unSelectedAttributes.push(attr);
    }
  });

  const { combinations, subsets, membership } = getSubsets(
    usedSets,
    calculatedAttributes.filter(attr => attr.type === 'sets')[0],
    depth
  );

  const labelAttribute: Attribute = attributes.find(d => d.type === 'id') as Attribute;

  return {
    info,
    sets,
    usedSets,
    subsets,
    calculatedAttributes,
    attributes,
    selectedAttributes,
    unSelectedAttributes,
    combinations,
    items,
    labelAttribute,
    depth,
    noDefaultSets,
    unusedSets,
    membership,
    dataset: data
  };
}

export function updateVisibleAttribute(data: Data, attributes: string[]): Data {
  if (attributes.length > 0) {
    const attrs = data.attributes.filter(d => d.name !== data.labelAttribute.name);
    data.selectedAttributes = attrs.filter(d => attributes.includes(d.name));
    data.unSelectedAttributes = attrs.filter(d => !attributes.includes(d.name));
  }
  return data;
}

export function updateVisibleSets(data: Data, sets: string[]): Data {
  if (sets.length > 0) {
    data.usedSets = data.sets.filter(d => sets.includes(d.elementName));
    data.unusedSets = data.sets.filter(d => !sets.includes(d.elementName));
    data = {
      ...data,
      ...getSubsets(
        data.usedSets,
        data.calculatedAttributes.filter(attr => attr.type === 'sets')[0],
        data.depth
      )
    };
  }
  return data;
}

export function applyAggregation(
  dataset: Data,
  inputData: Elements,
  firstAggregation: AggregationOptions,
  secondAggregation: AggregationOptions,
  firstOverlap: number,
  secondOverlap: number
): Elements {
  if (inputData.length === 0) return inputData;
  let data = [...inputData];

  const setNameDictionary: SetNameDictionary = {};

  dataset.usedSets.forEach((s, i) => {
    setNameDictionary[i] = s.elementName;
  });

  if (firstAggregation === 'None') return data;

  data = applyFirstAggregation(
    data,
    firstAggregation,
    setNameDictionary,
    firstOverlap,
    dataset.subsets.filter(d => d.noCombinedSets === firstOverlap).map(d => d.combinedSets)
  );

  if (secondAggregation === 'None') return data;

  return data;
}

export function applyHideEmpty(originalData: Data, hideEmpty: boolean) {
  if (!originalData) return [];

  let data = [...originalData.subsets];

  if (hideEmpty) {
    data = data.filter(s => s.size !== 0);
  }
  return data;
}

export function applyMinMaxDegree(data: Subsets, minDegree: number, maxDegree: number) {
  return data.filter(d => d.noCombinedSets >= minDegree && d.noCombinedSets <= maxDegree);
}

export function applySort(
  originalData: Data,
  inputData: Elements,
  sortBy: SortingOptions,
  sortBySetName: string,
  firstAggregation: AggregationOptions,
  secondAggregation: AggregationOptions
) {
  let data = [...inputData];

  if (firstAggregation !== 'None') {
    if (secondAggregation !== 'None') {
    } else {
      data = sortOnlyFirstAggregation(inputData as Groups, sortBy);
    }
  } else {
    data = sortWithoutAggregation(data, sortBy, sortBySetName, originalData);
  }

  return data;
}

export function getRenderRows(
  inputData: Elements,
  firstAggregation: AggregationOptions,
  secondAggregation: AggregationOptions
): RenderRows {
  let data: RenderRows = [];

  if (firstAggregation !== 'None') {
    if (secondAggregation !== 'None') {
    } else {
      (inputData as Groups).forEach(group => {
        data.push({ id: group.id, element: group });
        data = [
          ...data,
          ...group.subsets.map(subset => ({
            id: `${group.id}_${subset.id}`,
            element: subset
          }))
        ];
      });
    }
  } else {
    data = inputData.map(renderRowMap);
  }

  // let renderRows = data.map(renderRowMap);
  return data;
}

function renderRowMap(element: Element) {
  return {
    id: element.id,
    element
  };
}

function createSignature(usedSetIds: string[], listOfSets: string[]) {
  return usedSetIds.map(sets => (listOfSets.indexOf(sets) > -1 ? 1 : 0)).join('');
}

function getSubsets(usedSets: Sets, setAttribute: Attribute, depth: number) {
  const combinations = Math.pow(2, usedSets.length) - 1;
  const subsets: Subsets = [];

  let aggregateIntersection: { [key: string]: number[] } = {};

  let usedSetsId = usedSets.map(u => u.id);

  let signature = '';
  let membership: Membership = {};

  setAttribute.values.forEach((listOfSets, idx) => {
    signature = createSignature(usedSetsId, listOfSets);
    if (!aggregateIntersection[signature]) {
      aggregateIntersection[signature] = [];
    }
    aggregateIntersection[signature].push(idx);
  });

  let usedSetLength = usedSets.length;

  for (let bitmask = 0; bitmask <= combinations; ++bitmask) {
    let names: string[] = [];

    let combinedSetsFlat = '';

    let actualBit = -1;
    let tempBitMask = bitmask;

    let combinedSets: number[] = Array.apply(null, new Array(usedSetLength))
      .map(() => {
        actualBit = tempBitMask % 2;
        tempBitMask = (tempBitMask - actualBit) / 2;
        return +actualBit;
      })
      .reverse();

    combinedSetsFlat = combinedSets.join('');

    names = [];
    let expectedValue = 1;
    let notExpectedValue = 1;

    combinedSets.forEach((d, i) => {
      if (d === 1) {
        names.push(usedSets[i].elementName);
        expectedValue = expectedValue * usedSets[i].dataRatio;
      } else {
        notExpectedValue = notExpectedValue * (1 - usedSets[i].dataRatio);
      }
    });

    expectedValue *= notExpectedValue;

    let list = aggregateIntersection[combinedSetsFlat];

    if (!list) list = [];

    let name = '';

    names = names.map(n => n.replace(' ', '_'));

    if (names.length > 0) name = names.reverse().join(' ') + '';

    if (name === '') {
      name = 'UNINCLUDED';
    }

    let subset = createSubset(bitmask.toString(), name, combinedSets, list, expectedValue, depth);
    subsets.push(subset);
    membership = updateMembership(membership, subset.items, subset.id);
  }

  return { combinations, subsets, membership };
}

function updateMembership(membership: Membership, items: number[], belongsTo: string) {
  items.forEach(item => {
    if (!membership[item]) membership[item] = [];
    membership[item].push(belongsTo);
  });

  return membership;
}

function getAttributes(
  data: DSVParsedArray<DSVRowString>,
  sets: Sets,
  info: DatasetInfo,
  rawData: RawData,
  depth: number
) {
  const attributes: Attributes = [];
  const calculatedAttributes: Attributes = [];

  info.meta.forEach(meta => {
    attributes.push({
      name: meta.name || rawData.header[meta.index],
      type: meta.type,
      values: [],
      sort: 1
    });
  });

  let setCountAttribute: Attribute = {
    name: 'Set Count',
    type: 'integer',
    values: [],
    sort: 1,
    min: 0
  };

  for (let d = 0; d < depth; ++d) {
    let setCount = 0;

    for (let s = 0; s < rawData.rawSets.length; ++s) {
      setCount += rawData.rawSets[s][d];
    }

    setCountAttribute.values[d] = setCount;
  }
  calculatedAttributes.push(setCountAttribute);

  let setAttribute: Attribute = {
    name: 'Sets',
    type: 'sets',
    values: [],
    sort: 1
  };

  for (let i = 0; i < depth; ++i) {
    let setList: Array<number | string> = [];

    for (let s = 0; s < rawData.rawSets.length; ++s) {
      if (rawData.rawSets[s][i] === 1) {
        setList.push(sets[s].id);
      }
    }

    setAttribute.values[i] = setList;
  }

  calculatedAttributes.push(setAttribute);

  info.meta.forEach((meta, id) => {
    attributes[id].values = data.map(row => {
      let val = Object.values(row)[meta.index] as string;
      switch (meta.type) {
        case 'integer':
          let intVal = parseInt(val, 10);
          if (isNaN(intVal)) {
            throw new Error(`Cannot parse ${val} to integer`);
          }
          return intVal;
        case 'float':
          let floatVal = parseFloat(val);
          if (isNaN(floatVal)) {
            throw new Error(`Cannot parse ${val} to float`);
          }
          return floatVal;
        case 'id':
        case 'string':
        default:
          return val;
      }
    });
  });

  attributes
    .filter(d => numericAttributeType.includes(d.type))
    .forEach(attr => {
      const vals = attr.values;
      attr.min = Math.min(...vals);
      attr.max = Math.max(...vals);
    });

  return { attributes, calculatedAttributes };
}

function getSets(data: RawData, depth: number) {
  const { setNames, rawSets } = data;
  let setPrefix = 'S_';

  const sets: Sets = [];

  setNames.forEach((setName, i) => {
    let combinedSets = Array.apply(null, new Array(rawSets.length)).map(
      Number.prototype.valueOf,
      0
    );

    combinedSets[i] = 1;

    const set: Set = createSet(`${setPrefix}${i}`, setName, combinedSets, rawSets[i], depth);
    sets.push(set);
  });

  return { sets };
}

function getRawData(data: DSVParsedArray<DSVRowString>, info: DatasetInfo) {
  let rawData: RawData = {
    rawSets: [],
    setNames: [],
    header: data.columns
  };

  let depth: number = 0;
  const items: number[] = [];

  const { header } = rawData;

  let processedSetCount = 0;

  info.sets.forEach((set, idx) => {
    if (set.format !== 'binary') {
      throw new Error(`Set definition format ${set.format} not supported.`);
    }

    let setDefLength = set.end - set.start + 1;

    for (let setCount = 0; setCount < setDefLength; ++setCount) {
      rawData.rawSets.push(new Array<number>());
    }

    let rows = data.map(row => {
      return Object.entries(row)
        .map(t => t[1])
        .map((val: any, colIdx: number) => {
          if (colIdx < set.start || colIdx > set.end) return null;
          let intVal = parseInt(val, 10);
          if (isNaN(intVal)) {
            throw new Error(`Cannot parse ${intVal}`);
          }
          return intVal;
        });
    });

    rows.forEach((row, r) => {
      if (idx === 0) {
        items.push(depth++);
      }

      for (let s = 0; s < setDefLength; ++s) {
        rawData.rawSets[processedSetCount + s].push(row[set.start + s] as number);

        if (r === 1) {
          rawData.setNames.push(header[set.start + s]);
        }
      }
    });

    processedSetCount += setDefLength;
  });

  return { rawData, items, depth };
}

export { createData };
