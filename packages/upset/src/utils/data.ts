import { process } from '@visdesignlab/upset2-core';
import { UpsetItem } from '../types';

/**
 * Derives attribute columns from the given data types.
 *
 * @param data - The array of UpsetItem objects.
 * @returns An object containing attribute columns derived from the data.
 */
function deriveAttributeColumns(data: UpsetItem[]) {
  const attributeColumns: Record<string, any> = {};

  if (data.length > 0) {
    Object.entries(data[0]).forEach(([key, value]) => {
      attributeColumns[key] = typeof value === 'string' ? 'label' : typeof value;
    });
  }

  return attributeColumns;
}

/**
 * Processes the raw data by deriving attribute columns and passing them to the UpSet core process function.
 *
 * @param data - The raw data to be processed.
 * @returns The processed data.
 */
export function processRawData(data: UpsetItem[]) {
  const attributeColumns = deriveAttributeColumns(data);

  return process(data as any, { columns: attributeColumns } as any);
}
