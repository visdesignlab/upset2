import { DSVRowArray } from 'd3';
import hyperid from 'hyperid';
import {
  ColumnDefs,
  Subsets,
  Sets,
  ColumnName,
  Meta,
  SetMembershipStatus,
  Subset,
  ISet,
  Item,
  CoreUpsetData,
} from './types';

function calculateDeviation(
  totalItems: number,
  intersectionSize: number,
  sets: Sets,
  vSets: string[],
  containedSets: string[],
): number {
  const containedProduct = containedSets
    .map((s) => {
      const set = sets[s];
      return set.size / totalItems;
    })
    .reduce((acc, val) => acc * val, 1);

  const nonContainedProduct = vSets
    .filter((v) => !containedSets.includes(v))
    .map((s) => {
      const set = sets[s];
      return 1 - set.size / totalItems;
    })
    .reduce((acc, val) => acc * val, 1);

  const dev =
    intersectionSize / totalItems - containedProduct * nonContainedProduct;

  return dev * 100;
}

function getIdGenerator(prefix?: string) {
  const gen = hyperid({ urlSafe: true });

  if (prefix && prefix.length > 0) {
    return () => `${prefix}_${gen()}`;
  }

  return gen;
}

function getLabel(columns: ColumnDefs): ColumnName | false {
  const labelColumns = Object.entries(columns)
    .filter((col) => col[1] === 'label')
    .map((col) => col[0]);

  if (labelColumns.length === 0) return false;

  return labelColumns[0];
}

function getSetColumns(columns: ColumnDefs): ColumnName[] {
  return Object.entries(columns)
    .filter((col) => col[1] === 'boolean')
    .map((col) => col[0]);
}

function processRawData(data: DSVRowArray, columns: ColumnDefs) {
  const itemId = getIdGenerator('Item');
  const labelColumn = getLabel(columns) || '_id';
  const setColumns = getSetColumns(columns);

  const items: { [id: string]: Item } = {};

  const setMembership: { [col: string]: string[] } = {};

  data.forEach((row) => {
    const id = itemId();

    const item: Item = {
      _id: id,
      _label: labelColumn === 'id' ? id : (row[labelColumn] as string),
      ...row,
    };
    items[id] = item;

    Object.entries(columns).forEach(([col, type]) => {
      if (type === 'number') {
        item[col] = parseFloat(item[col] as any);
      }

      if (type === 'boolean') {
        item[col] = parseInt(item[col] as any, 10);

        if (!setMembership[col]) setMembership[col] = [];

        if (item[col] === 1) setMembership[col].push(item['_id']);
      }
    });
  });

  return {
    labelColumn,
    setColumns,
    items,
    setMembership,
  };
}

function getSets(
  setMembership: { [col: string]: string[] },
  setColumns: ColumnName[],
) {
  const setIdGen = getIdGenerator('Set');

  const setMembershipStatus: { [col: string]: SetMembershipStatus } = {};

  setColumns.forEach((set) => {
    setMembershipStatus[set] = 'No';
  });

  const sets: Sets = {};
  setColumns.forEach((col) => {
    const set: ISet = {
      id: setIdGen(),
      elementName: col,
      items: setMembership[col],
      type: 'Set',
      size: setMembership[col].length,
      setMembership: { ...setMembershipStatus, [col]: 'Yes' },
    };

    sets[set.id] = set;
  });

  return sets;
}

export function process(data: DSVRowArray, meta: Meta): CoreUpsetData {
  const { columns } = meta;

  const { items, setMembership, labelColumn, setColumns } = processRawData(
    data,
    columns,
  );
  const sets = getSets(setMembership, setColumns);

  return {
    label: labelColumn,
    setColumns,
    columns: Object.keys(columns),
    items,
    sets,
  };
}

export function getSubsets(
  items: Item[],
  sets: Sets,
  vSets: string[],
): Subsets {
  if (vSets.length === 0) return {};

  const subsetIdGen = getIdGenerator('Subset');

  const vSetNames = vSets.map((v) => sets[v].elementName);

  const comboCount = 2 ** vSets.length - 1;
  const subsets: Subsets = {};

  const setIntersectionMembership: { [key: string]: string[] } = {};

  const intersectionName: { [key: string]: string } = {};

  for (let b = 0; b <= comboCount; ++b) {
    const combo = b.toString(2).padStart(vSets.length, '0');
    setIntersectionMembership[combo] = [];
    const name = vSetNames
      .filter((_, i) => combo[i] === '1')
      .map((v) => v.replace(' ', '_'))
      .join(' ');
    intersectionName[combo] = name || 'Unincluded';
  }

  items.forEach((item) => {
    const itemMembership = vSetNames.map((v) => item[v]).join('');
    setIntersectionMembership[itemMembership].push(item['_id']);
  });

  Object.entries(setIntersectionMembership).forEach(([comboBinary, itm]) => {
    const combo: SetMembershipStatus[] = comboBinary.split('').map((c) => {
      const val = parseInt(c, 10);
      switch (val) {
        case 1:
          return 'Yes';
        case 0:
          return 'No';
        default:
          return 'May';
      }
    });

    const deviation = calculateDeviation(
      items.length,
      itm.length,
      sets,
      vSets,
      vSets.filter((d) => d === 'Yes'),
    );

    const setMembershipStatus: { [col: string]: SetMembershipStatus } = {};

    vSets.forEach((set, idx) => {
      setMembershipStatus[set] = combo[idx];
    });

    const subset: Subset = {
      id: subsetIdGen(),
      elementName: intersectionName[comboBinary],
      items: itm,
      size: itm.length,
      type: 'Subset',
      setMembership: setMembershipStatus,
      deviation,
    };

    subsets[subset.id] = subset;
  });

  return subsets;
}
