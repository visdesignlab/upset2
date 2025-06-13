import { ColumnType, process } from '@visdesignlab/upset2-core';
import { UpsetItem } from '../types';

/**
 * Derives attribute columns from the given data types.
 *
 * @param data - The array of UpsetItem objects.
 * @returns An object containing attribute columns derived from the data.
 */
function deriveAttributeColumns(data: UpsetItem[]): Record<string, ColumnType> {
  const attributeColumns: Record<string, ColumnType> = {};

  if (data.length > 0) {
    Object.entries(data[0]).forEach(([key, value]) => {
      const type = typeof value;
      switch (type) {
        case 'string':
          attributeColumns[key] = 'label';
          break;
        case 'bigint':
          attributeColumns[key] = 'number';
          break;
        case 'symbol':
          attributeColumns[key] = 'string';
          break;
        case 'undefined':
        case 'object':
        case 'function':
          break; // Skip undefined, object, and function types
        default:
          attributeColumns[key] = type;
      }
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

  return process(
    data.map((item) => ({
      ...item,
      _key: item.id.toString(),
      _id: item.id.toString(),
      _rev: '',
    })),
    attributeColumns,
  );
}
