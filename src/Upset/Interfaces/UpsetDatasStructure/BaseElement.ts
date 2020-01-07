import RowType from './RowType';

export interface BaseElement {
  id: string;
  elementName: string;
  items: number[];
  size: number;
  dataRatio: number;
  itemMembership: number[];
  type: RowType;
}

export function createBaseElement(id: string, elementName: string): BaseElement {
  return {
    id,
    elementName,
    items: [],
    size: 0,
    dataRatio: 0,
    type: 'Undefined',
    itemMembership: []
  };
}
