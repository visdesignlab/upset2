import {
  AccessibleData, Aggregate, AltTextConfig, CoreUpsetData, Row, Rows, UpsetConfig, getDegreeFromSetMembership, isRowAggregate,
} from '@visdesignlab/upset2-core';
import { UpsetProvenance } from '../provenance';

export const getAccessibleData = (rows: Rows, includeId = false): AccessibleData => {
  const data = { values: {} } as AccessibleData;
  Object.values(rows.values).forEach((r: Row) => {
    // if the key is ONLY one set, the name should be "Just {set name}"
    // any key with more than one set should include "&" between the set names
    const degree = getDegreeFromSetMembership(r['setMembership']);

    data['values'][r['id']] = {
      elementName: r['elementName'],
      type: r['type'],
      size: r['size'],
      deviation: r['deviation'],
      attributes: r['attributes'],
      degree,
    };

    if (includeId) {
      data['values'][r['id']].id = r['id'];
    }

    if (isRowAggregate(r)) {
      data['values'][r['id']]['items'] = getAccessibleData(r['items'], includeId).values;
    } else {
      data['values'][r['id']]['setMembership'] = r['setMembership'];
    }
  });

  return data;
};

const downloadJSON = (filename: string, json: string): void => {
  const blob = new Blob([json], { type: 'application/json' });
  const href = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = href;
  link.download = `${filename}.json`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

const generateElementName = (rows: Rows, vSetNames: string[]): Rows => {
  const newRows = { ...rows };

  Object.values(newRows.values).forEach((r: Row) => {
    const splitElName = r['elementName'].split('~&~');

    let elName = splitElName.join(', ');

    if (splitElName.length > 1) {
      const lastWord = splitElName.pop();
      // elName = `${elName}, and ${lastWord}`;
      elName = `${splitElName.join(', ')}, and ${lastWord}`;
    } else if (r.type === 'Aggregate') {
      const r2 = r as Aggregate;
      if (r2.aggregateBy === 'Overlaps') {
        elName = elName.split(' - ').join(' & '); // overlaps look like "Adventure - Action", so replace the hyphen with " & "
      }
    } else {
      elName = `Just ${elName}`;
    }

    r['elementName'] = elName;
  });

  return newRows;
};

export const getAltTextConfig = (state: UpsetConfig, data: CoreUpsetData, rows: Rows): AltTextConfig => {
  let dataObj = state as AltTextConfig;

  console.log(rows.order);

  const updatedRows = generateElementName(rows, dataObj.visibleSets);

  dataObj = {
    ...dataObj,
    rawData: data,
    processedData: updatedRows,
    accessibleProcessedData: getAccessibleData(updatedRows),
  };

  return dataObj;
};

export const exportState = (provenance: UpsetProvenance, data?: CoreUpsetData, rows?: Rows): void => {
  let filename = `upset_state_${new Date().toJSON().slice(0, 10)}`;
  let dataObj = provenance.getState() as UpsetConfig & { rawData?: CoreUpsetData; processedData?: Rows; accessibleProcessedData?: AccessibleData };

  if (data && rows) {
    const updatedRows = generateElementName(rows, dataObj.visibleSets);
    dataObj = {
      ...dataObj, rawData: data, processedData: updatedRows, accessibleProcessedData: getAccessibleData(updatedRows),
    };
    filename = `upset_state_data_${new Date().toJSON().slice(0, 10)}`;
  } else if (data) {
    dataObj = { ...dataObj, rawData: data };
    filename = `upset_state_raw_data_${new Date().toJSON().slice(0, 10)}`;
  }

  const json = JSON.stringify(dataObj, null, 2);

  downloadJSON(filename, json);
};

export const exportRawData = (data: CoreUpsetData): void => {
  const filename = `upset_data_raw_${new Date().toJSON().slice(0, 10)}`;
  const json = JSON.stringify(data, null, 2);
  downloadJSON(filename, json);
};

export const exportProcessedData = (rows: Rows, accessible?: boolean): void => {
  const filename = `upset_data_${new Date().toJSON().slice(0, 10)}`;
  const data: Rows | AccessibleData = (accessible) ? getAccessibleData(rows) : rows;

  const json = JSON.stringify(data, null, 2);

  downloadJSON(filename, json);
};
