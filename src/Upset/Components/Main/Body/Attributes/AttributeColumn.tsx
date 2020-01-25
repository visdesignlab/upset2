import React, { FC } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { Attribute } from '../../../../Interfaces/UpsetDatasStructure/Attribute';
import { AttributeRenderRows } from '../../../../Interfaces/UpsetDatasStructure/Data';
import AttributeRows from './AttributeRows';
import { AttributeVisualizationType } from './AttributeRow';

export interface AttributeColumnProps {
  store?: UpsetStore;
  attribute: Attribute;
  rows: AttributeRenderRows;
  rowHeight: number;
  width: number;
  padding: number;
  renderType?: AttributeVisualizationType;
}

const AttributeColumn: FC<AttributeColumnProps> = ({
  attribute,
  rows,
  rowHeight,
  width,
  padding,
  renderType = 'Dot'
}: AttributeColumnProps) => {
  return (
    <AttributeRows
      width={width}
      rows={rows}
      rowHeight={rowHeight}
      padding={padding}
      attribute={attribute}
      renderType={renderType}
    ></AttributeRows>
  );
};

export default inject('store')(observer(AttributeColumn));
