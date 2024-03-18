import {
  DSVRowArray, max, mean, median, min, quantile,
} from 'd3';

import {
  Attributes,
  ColumnDefs,
  ColumnName,
  CoreUpsetData,
  ISet,
  Item,
  Items,
  Meta,
  SetMembershipStatus,
  Sets,
  Subset,
  Subsets,
} from './types';

/**
 * Calculates the deviation based on the total number of items, intersection size,
 * sets, vSets, and containedSets.
 *
 * @param totalItems - The total number of items.
 * @param intersectionSize - The size of the intersection.
 * @param sets - The sets object.
 * @param vSets - The vSets array.
 * @param containedSets - The containedSets array.
 * @returns The calculated deviation.
 */
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

/**
 * Generates an ID by concatenating a prefix with an array of strings.
 * Replaces spaces in each string with underscores.
 * 
 * @param prefix - The prefix to be added to the ID.
 * @param arr - An array of strings to be concatenated.
 * @returns The generated ID.
 */
export function getId(prefix: string, ...arr: string[]) {
  return `${prefix}_${arr.map((s) => s.replace(' ', '_')).join('_')}`;
}

/**
 * Retrieves the first column name that has a value of 'label' in the given column definitions.
 * @param columns - The column definitions object.
 * @returns The column name with the value 'label', or false if no such column exists.
 */
function getLabel(columns: ColumnDefs): ColumnName | false {
  const labelColumns = Object.entries(columns)
    .filter((col) => col[1] === 'label')
    .map((col) => col[0]);

  if (labelColumns.length === 0) return false;

  return labelColumns[0];
}

/**
 * Retrieves the column names from the given column definitions object
 * where the column type is 'boolean'.
 *
 * @param columns - The column definitions object.
 * @returns An array of column names.
 */
function getSetColumns(columns: ColumnDefs): ColumnName[] {
  return Object.entries(columns)
    .filter((col) => col[1] === 'boolean')
    .map((col) => col[0]);
}

/**
 * Retrieves the attribute columns from the given column definitions.
 * 
 * @param columns - The column definitions.
 * @returns An array of attribute column names.
 */
function getAttributeColumns(columns: ColumnDefs): ColumnName[] {
  return Object.entries(columns)
    .filter((col) => col[1] === 'number')
    .map((col) => col[0]);
}

/**
 * Processes raw data and returns an object containing various properties.
 * 
 * @param data - The raw data to be processed.
 * @param columns - The column definitions.
 * @returns An object containing the processed data.
 */
function processRawData(data: DSVRowArray, columns: ColumnDefs) {
  const labelColumn = getLabel(columns) || '_id';
  const setColumns = getSetColumns(columns);
  const attributeColumns = getAttributeColumns(columns);

  const items: { [id: string]: Item } = {};

  const setMembership: { [col: string]: string[] } = {};

  data.forEach((row, idx) => {
    const id = row['_id'] ? row['_id'] : getId('Item', idx.toString());

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
        const val = item[col];
        item[col] = typeof val === 'boolean' ? +val : parseInt(val as any, 10);

        if (!setMembership[col]) setMembership[col] = [];

        if (item[col] === 1) setMembership[col].push(item['_id']);
      }
    });
  });

  return {
    labelColumn,
    setColumns,
    attributeColumns,
    items,
    setMembership,
  };
}

/**
 * Calculates the five-number summary for each attribute in the given items.
 * 
 * @param items - The items to calculate the summary for.
 * @param memberItems - The member items to consider.
 * @param attributeColumns - The attribute columns to calculate the summary for.
 * @returns An object containing the five-number summary for each attribute.
 */
export function getFiveNumberSummary(
  items: Items,
  memberItems: string[],
  attributeColumns: string[],
): Attributes {
  const attributes: Attributes = {};

  attributeColumns.forEach((attribute) => {
    const values = memberItems
      .map((d) => items[d][attribute] as number)
      .filter((val) => !Number.isNaN(val));

    attributes[attribute] = {
      min: min(values),
      max: max(values),
      median: median(values),
      mean: mean(values),
      first: quantile(values, 0.25),
      third: quantile(values, 0.75),
    };
  });

  return attributes;
}

/**
 * Retrieves the sets based on the set membership, set columns, items, and attribute columns.
 *
 * @param setMembership - The set membership object containing the mapping of columns to set membership arrays.
 * @param setColumns - The array of column names representing the set columns.
 * @param items - The items object containing the data items.
 * @param attributeColumns - The array of column names representing the attribute columns.
 * @returns The sets object containing the retrieved sets.
 */
function getSets(
  setMembership: { [col: string]: string[] },
  setColumns: ColumnName[],
  items: Items,
  attributeColumns: ColumnName[],
) {
  const setMembershipStatus: { [col: string]: SetMembershipStatus } = {};

  setColumns.forEach((set) => {
    setMembershipStatus[set] = 'No';
  });

  const sets: Sets = {};
  setColumns.forEach((col) => {
    const set: ISet = {
      id: getId('Set', col),
      elementName: col,
      items: setMembership[col],
      type: 'Set',
      size: setMembership[col].length,
      setMembership: { ...setMembershipStatus, [col]: 'Yes' },
      attributes: getFiveNumberSummary(
        items,
        setMembership[col],
        attributeColumns,
      ),
    };

    sets[set.id] = set;
  });

  return sets;
}

/**
 * Processes the data and returns the core upset data.
 *
 * @param data - The input data in DSVRowArray format.
 * @param meta - The metadata object containing information about the columns.
 * @returns The core upset data object.
 */
export function process(data: DSVRowArray, meta: Meta): CoreUpsetData {
  const { columns } = meta;

  const {
    items, setMembership, labelColumn, setColumns, attributeColumns,
  } =
    processRawData(data, columns);
  const sets = getSets(setMembership, setColumns, items, attributeColumns);

  return {
    label: labelColumn,
    setColumns,
    attributeColumns,
    columns: Object.keys(columns),
    columnTypes: columns,
    items,
    sets,
  };
}

/**
 * Calculates the subsets based on the provided data items, sets, vSets, and attribute columns.
 * @param dataItems - The data items to calculate subsets from.
 * @param sets - The sets used to calculate subsets.
 * @param vSets - The vSets used to calculate subsets.
 * @param attributeColumns - The attribute columns used to calculate subsets.
 * @returns The calculated subsets.
 */
export function getSubsets(
  dataItems: { [k: string]: Item },
  sets: Sets,
  vSets: string[],
  attributeColumns: string[],
): Subsets {
  if (vSets.length === 0) {
    return {
      values: {},
      order: [],
    };
  }

  const items = Object.values(dataItems);

  const vSetNames = vSets.map((v) => sets[v].elementName);

  const comboCount = 2 ** vSets.length - 1;
  const subsets: Subsets = {
    values: {},
    order: [],
  };

  const setIntersectionMembership: { [key: string]: string[] } = {};

  const intersectionName: { [key: string]: string } = {};

  for (let b = 0; b <= comboCount; ++b) {
    const combo = b.toString(2).padStart(vSets.length, '0');
    setIntersectionMembership[combo] = [];
    const name = vSetNames
      .filter((_, i) => combo[i] === '1')
      .join('~&~');
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
      vSets.filter((_, i) => combo[i] === 'Yes'),
    );

    const setMembershipStatus: { [col: string]: SetMembershipStatus } = {};

    vSets.forEach((set, idx) => {
      setMembershipStatus[set] = combo[idx];
    });

    const subset: Subset = {
      id: getId('Subset', intersectionName[comboBinary]),
      elementName: intersectionName[comboBinary],
      items: itm,
      size: itm.length,
      type: 'Subset',
      setMembership: setMembershipStatus,
      deviation,
      attributes: getFiveNumberSummary(dataItems, itm, attributeColumns),
    };

    subsets.values[subset.id] = subset;
    subsets.order.push(subset.id);
  });

  return subsets;
}
