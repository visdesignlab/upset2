import {
  CoreUpsetData, deepCopy, process,
} from '@visdesignlab/upset2-core';

export const oneHotEncode = (encodeList: string[], data: CoreUpsetData, empty?: boolean) => {
  const newColNames: string[] = [];
  const encodedData: CoreUpsetData = deepCopy(data);

  // close the error window
  if (empty) {
    return encodedData;
  }

  // get the unique names of every new column to be added.
  //    ex: group1_a, group1_b, group2_a, group2_b, group3_c, ....
  encodeList.forEach((s) => Object.entries(data.items).forEach(([_, row]) => {
    const names = `${row[s]}`
      .split(',')
      .filter((n) => n !== '')
      .map((val) => `${s}_${val}`);
    newColNames.push(...names);
  }));
  const uniqueColNames: Set<string> = new Set(newColNames);

  // populate the data items group membership
  Object.entries(encodedData.items).forEach(([_, row]) => {
    Array.from(uniqueColNames).forEach((col) => {
      const splitCol = col.split('_');
      row[col] = `${row[splitCol[0]]}`.includes(splitCol[1]);
    });
  });

  // create the new annotations to pass into process, these are needed to ensure that the columns are added to columnTypes
  const newAnnotations = Array.from(uniqueColNames).map((col) => ({ [col]: 'boolean' } as { [key: string]: 'boolean' }))
    .reduce((obj, item) => Object.assign(obj, item), {});

  const annotations = { ...encodedData.columnTypes, ...newAnnotations };

  // Casting as the columnTypes will always be 'boolean', so
  return process(Object.values(encodedData.items).map((item) => ({ _key: '', _rev: '', ...item })), annotations);
};
