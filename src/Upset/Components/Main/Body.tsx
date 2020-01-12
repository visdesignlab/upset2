import React, { FC } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import CardinalityRows from './Body/CardinalityRows';
import { RenderRows } from '../../Interfaces/UpsetDatasStructure/Data';

interface Props {
  store?: UpsetStore;
  className: string;
  height: number;
  width: number;
  padding: number;
  attributeWidth: number;
  renderRows: RenderRows;
  rowHeight: number;
}

const Body: FC<Props> = ({
  className,
  height,
  width,
  padding,
  attributeWidth,
  renderRows,
  rowHeight
}: Props) => {
  return (
    <svg className={className} height={height} width={width}>
      <CardinalityRows
        rowHeight={rowHeight}
        rows={renderRows}
        width={attributeWidth}
        padding={padding}
      />
    </svg>
  );
};

export default inject('store')(observer(Body));
