import React, { FC, useContext } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import CardinalityRows from './Body/Cardinality/CardinalityRows';
import { RenderRows } from '../../Interfaces/UpsetDatasStructure/Data';
import { SizeContext } from '../../Upset';
import SurpriseCardinalityRows from './Body/Surprise/SurpriseCardinalityRows';
import DeviationRows from './Body/Deviation/DeviationRows';

interface Props {
  store?: UpsetStore;
  className: string;
  renderRows: RenderRows;
  maxSize: number;
  deviationLimit: number;
}

const Body: FC<Props> = ({ className, renderRows, maxSize, deviationLimit }: Props) => {
  const {
    matrixHeight: height,
    attributes: { totalHeaderWidth: width, attributePadding: padding, attributeWidth },
    rowHeight
  } = useContext(SizeContext);

  return (
    <svg className={className} height={height} width={width}>
      <CardinalityRows
        rowHeight={rowHeight}
        rows={renderRows}
        width={attributeWidth}
        padding={padding}
      />
      <g transform={`translate(${attributeWidth + padding}, 0)`}>
        <SurpriseCardinalityRows
          rows={renderRows}
          rowHeight={rowHeight}
          width={attributeWidth}
          padding={padding}
          globalCardinalityLimit={maxSize}
        ></SurpriseCardinalityRows>
      </g>
      <g transform={`translate(${(attributeWidth + padding) * 2})`}>
        <DeviationRows
          rows={renderRows}
          rowHeight={rowHeight}
          width={attributeWidth}
          padding={padding}
          deviationLimit={deviationLimit}
        ></DeviationRows>
      </g>
    </svg>
  );
};

export default inject('store')(observer(Body));
