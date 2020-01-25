import React, { FC, useContext, useMemo } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import CardinalityRows from './Body/Cardinality/CardinalityRows';
import { RenderRows, AttributeRenderRows } from '../../Interfaces/UpsetDatasStructure/Data';
import { SizeContext } from '../../Upset';
import SurpriseCardinalityRows from './Body/Surprise/SurpriseCardinalityRows';
import DeviationRows from './Body/Deviation/DeviationRows';
import translate from '../ComponentUtils/Translate';
import { Attributes, getStats } from '../../Interfaces/UpsetDatasStructure/Attribute';
import AttributeColumn from './Body/Attributes/AttributeColumn';
import { DSVParsedArray, DSVRowString } from 'd3';

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
  className,
  renderRows,
  maxSize,
  deviationLimit,
  attributes,
  dataset
}: Props) => {
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

  const attributesBody = useMemo(() => {
    return attributes.map((attr, idx) => {
      const rows: AttributeRenderRows = renderRows.map(r => {
        const { id, element } = r;

        const values = element.itemMembership
          .map(i => dataset[i][attr.name])
          .map(a => {
            return attr.type === 'integer' ? parseInt(a as string, 10) : parseFloat(a as string);
          });

        const stats = getStats(values);

        return { id, element, values, stats };
      });

      return (
        <g key={attr.name} transform={translate((padding + attributeWidth) * idx, 0)}>
          <AttributeColumn
            attribute={attr}
            rows={rows}
            rowHeight={rowHeight}
            width={attributeWidth}
            padding={padding}
          ></AttributeColumn>
        </g>
      );
    });
  }, [attributeWidth, attributes, dataset, padding, renderRows, rowHeight]);

  // const headersToAdd = { cardinalityRows, surpriseCardinalityRows, deviationRows };
  const headersToAdd = { cardinalityRows, deviationRows, attributesBody };

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
