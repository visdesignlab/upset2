import React, { FC, useContext } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import CardinalityRows from './Body/Cardinality/CardinalityRows';
import { RenderRows } from '../../Interfaces/UpsetDatasStructure/Data';
import { SizeContext } from '../../Upset';
import SurpriseCardinalityRows from './Body/Surprise/SurpriseCardinalityRows';
import DeviationRows from './Body/Deviation/DeviationRows';
import translate from '../ComponentUtils/Translate';

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

  const cardinalityRows = (
    <CardinalityRows
      rowHeight={rowHeight}
      rows={renderRows}
      width={attributeWidth}
      padding={padding}
    />
  );

  const surpriseCardinalityRows = (
    <SurpriseCardinalityRows
      rows={renderRows}
      rowHeight={rowHeight}
      width={attributeWidth}
      padding={padding}
      globalCardinalityLimit={maxSize}
    ></SurpriseCardinalityRows>
  );

  const deviationRows = (
    <DeviationRows
      rows={renderRows}
      rowHeight={rowHeight}
      width={attributeWidth}
      padding={padding}
      deviationLimit={deviationLimit}
    ></DeviationRows>
  );

  // const headersToAdd = { cardinalityRows, surpriseCardinalityRows, deviationRows };
  const headersToAdd = { cardinalityRows, deviationRows };

  const headers: JSX.Element[] = [];

  Object.entries(headersToAdd).forEach((header, idx) => {
    const [key, val] = header;
    headers.push(
      <g key={key} transform={translate((attributeWidth + padding) * idx, 0)}>
        {val}
      </g>
    );
  });

  return (
    <svg className={className} height={height} width={width}>
      {headers}
    </svg>
  );
};

export default inject('store')(observer(Body));
