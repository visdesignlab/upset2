import React, { FC, useContext } from 'react';
import CardinalityRows from './Body/Cardinality/CardinalityRows';
import { RenderRows } from '../../Interfaces/UpsetDatasStructure/Data';
import { SizeContext } from '../../Upset';
// import SurpriseCardinalityRows from './Body/Surprise/SurpriseCardinalityRows';
import DeviationRows from './Body/Deviation/DeviationRows';
import translate from '../ComponentUtils/Translate';
import { Attributes } from '../../Interfaces/UpsetDatasStructure/Attribute';
import { DSVParsedArray, DSVRowString } from 'd3';
import { SizeContextShape } from '../../Interfaces/SizeContext';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../Store/UpsetStore';
import AttributeRows from './Body/Attributes/AttributeRows';

interface Props {
  store?: UpsetStore;
  className: string;
  renderRows: RenderRows;
  maxSize: number;
  deviationLimit: number;
  attributes: Attributes;
  dataset: DSVParsedArray<DSVRowString>;
}

const Body: FC<Props> = ({
  store,
  className,
  renderRows,
  deviationLimit,
  attributes,
  dataset
}: Props) => {
  const sizeContext: SizeContextShape = JSON.parse(useContext(SizeContext));
  const {
    matrixHeight: height,
    attributes: { totalHeaderWidth: width, attributePadding: padding, attributeWidth },
    rowHeight
  } = sizeContext;

  const cardinalityRows = (
    <CardinalityRows
      rowHeight={rowHeight}
      rows={renderRows}
      width={attributeWidth}
      padding={padding}
    />
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

  const attributeRows = (
    <AttributeRows
      rows={renderRows}
      rowHeight={rowHeight}
      padding={padding}
      attributes={attributes}
      dataset={dataset}
      attributeWidth={attributeWidth}
    />
  );

  // const headersToAdd = { cardinalityRows, surpriseCardinalityRows, deviationRows };
  // const headersToAdd = { cardinalityRows, deviationRows, attributesBody };

  const headersToAdd = { cardinalityRows, deviationRows, attributeRows };
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
