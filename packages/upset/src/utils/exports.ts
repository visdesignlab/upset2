import {
  AccessibleData, Aggregate, AltTextConfig, CoreUpsetData, Row, Rows, UpsetConfig, getDegreeFromSetMembership, isRowAggregate,
} from '@visdesignlab/upset2-core';
import { UpsetProvenance } from '../provenance';

/**
 * Retrieves accessible data from rows.
 * @param rows - The rows containing the data.
 * @param includeId - Optional parameter to include the ID in the accessible data.
 * @returns The accessible data.
 */
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

/**
 * Downloads a JSON file with the given filename and content.
 *
 * @param filename - The name of the file to be downloaded.
 * @param json - The JSON content to be downloaded.
 */
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

/**
 * Generates element names based on the provided rows.
 * @param rows - The rows containing element names.
 * @returns The updated rows with modified element names.
 */
const generateElementName = (rows: Rows): Rows => {
  const newRows = { ...rows };

  Object.values(newRows.values).forEach((r: Row) => {
    if (r['elementName'] !== 'Unincluded') {
      const splitElName = r['elementName'].split('~&~');

      let elName = splitElName.join(', ');

      if (splitElName.length > 1) {
        if (r.type === 'Aggregate') {
          const r2 = r as Aggregate;
          // replace aggregate overlaps hyphen with " & " for better readability
          if (r2.aggregateBy === 'Overlaps') {
            elName = elName.split(' - ').join(' & ');
          }
        } else {
          const lastWord = splitElName.pop();
          elName = `${splitElName.join(', ')}, and ${lastWord}`;
        }
      } else {
        elName = `Just ${elName}`;
      }

      r['elementName'] = elName;
    }
  });

  return newRows;
};

/**
 * Retrieves the alternative text grammar config based on the provided state, data, and rows.
 * @param state - The UpsetConfig state object.
 * @param data - The CoreUpsetData object.
 * @param rows - The Rows object.
 * @returns The AltTextConfig object.
 */
export const getAltTextConfig = (state: UpsetConfig, data: CoreUpsetData, rows: Rows): AltTextConfig => {
  let dataObj = state as AltTextConfig;

  const updatedRows = generateElementName(rows);

  dataObj = {
    ...dataObj,
    rawData: data,
    processedData: updatedRows,
    accessibleProcessedData: getAccessibleData(updatedRows),
  };

  return dataObj;
};

/**
 * Exports the state of the Upset plot.
 * @param provenance - The UpsetProvenance object that tracks the state changes of the Upset component.
 * @param data - Optional. The CoreUpsetData data of the Upset component. (Raw Data)
 * @param rows - Optional. The rows data of the Upset component. (Processed Data)
 */
export const exportState = (provenance: UpsetProvenance, data?: CoreUpsetData, rows?: Rows): void => {
  let filename = `upset_state_${new Date().toJSON().slice(0, 10)}`;
  let dataObj = provenance.getState() as UpsetConfig & { rawData?: CoreUpsetData; processedData?: Rows; accessibleProcessedData?: AccessibleData };

  if (data && rows) {
    const updatedRows = generateElementName(rows);
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

/**
 * Exports the raw data as a JSON file.
 * @param data - The core upset data to be exported.
 */
export const exportRawData = (data: CoreUpsetData): void => {
  const filename = `upset_data_raw_${new Date().toJSON().slice(0, 10)}`;
  const json = JSON.stringify(data, null, 2);
  downloadJSON(filename, json);
};

/**
 * Exports processed data as a JSON file.
 * @param rows - The data to be exported.
 * @param accessible - Optional parameter indicating whether the exported data should fit the accessible datatype.
 */
export const exportProcessedData = (rows: Rows, accessible?: boolean): void => {
  const filename = `upset_data_${new Date().toJSON().slice(0, 10)}`;
  const data: Rows | AccessibleData = (accessible) ? getAccessibleData(rows) : rows;

  const json = JSON.stringify(data, null, 2);

  downloadJSON(filename, json);
};
