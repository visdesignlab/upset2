import { Sets, Set, createSet } from './Set';
import { BaseSet } from './BaseSet';
import { BaseElement } from './BaseElement';
import { Subsets, createSubset } from './Subset';
import { Attributes, Attribute } from './Attribute';
import { DatasetInfo } from '../DatasetInfo';
import { dsv, DSVParsedArray, DSVRowString } from 'd3';
import { SortingOptions } from '../SortOptions';

export type Element = Set | BaseSet | BaseElement;
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

export interface Data {
  sets: Sets;
  usedSets: Sets;
  subsets: Subsets;
  attributes: Attributes;
  selectedAttributes: Attributes;
  combinations: number;
  items: any[];
  depth: number;
  noDefaultSets: number;
  unusedSets: Sets;
  membership: Membership;
  dataset: DSVParsedArray<DSVRowString>;
}

async function createData(info: DatasetInfo): Promise<Data> {
  const usedSets: Sets = [];
  const selectedAttributes: Attributes = [];
  const noDefaultSets: number = 6;
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

  const { attributes } = getAttributes(data, sets, info, rawData, depth);

  const { combinations, subsets, membership } = getSubsets(
    usedSets,
    attributes.filter(attr => attr.type === 'sets')[0],
    depth
  );

  return {
    sets,
    usedSets,
    subsets,
    attributes,
    selectedAttributes,
    combinations,
    items,
    depth,
    noDefaultSets,
    unusedSets,
    membership,
    dataset: data
  };
}

function renderRowMap(element: Element) {
  return {
    id: element.id,
    element
  };
}

export function getRenderRows(
  originalData: Data,
  hideEmpty: boolean,
  minDegree: number,
  maxDegree: number,
  sortBy: SortingOptions,
  sortBySetName: string
): RenderRows {
  if (!originalData) return [];

  let data = [...originalData.subsets];

  if (hideEmpty) {
    data = data.filter(s => s.size !== 0);
  }

  data = data.filter(d => d.noCombinedSets >= minDegree && d.noCombinedSets <= maxDegree);

  if (sortBy === 'Cardinality') {
    data.sort((a, b) => b.size - a.size);
  } else if (sortBy === 'Degree') {
    data.sort((a, b) => a.noCombinedSets - b.noCombinedSets);
  } else if (sortBy === 'Set') {
    const usedSetsName = originalData.usedSets.map(d => d.elementName);
    const idx = usedSetsName.findIndex(s => s === sortBySetName);

    data.sort((a, b) => {
      return b.combinedSets[idx] - a.combinedSets[idx];
    });
  }

  let renderRows = data.map(renderRowMap);
  return renderRows;
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
  attributes.push(setCountAttribute);

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

  attributes.push(setAttribute);

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

  return { attributes };
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
