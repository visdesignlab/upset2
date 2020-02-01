import React, { FC } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { Attributes, getStats } from '../../../../Interfaces/UpsetDatasStructure/Attribute';
import { BaseElement } from '../../../../Interfaces/UpsetDatasStructure/BaseElement';
import translate from '../../../ComponentUtils/Translate';
import { AttributeVisualizationType } from './VisualizationType';
import { DSVParsedArray, DSVRowString, scaleLinear, ScaleLinear } from 'd3';
import { pure } from 'recompose';
import KDEPlot from './KDEPlot';
import BoxPlot from './BoxPlot';
import DotPlot from './DotPlot';

export interface AttributeRowProps {
  store?: UpsetStore;
  attributes: Attributes;
  element: BaseElement;
  width: number;
  height: number;
  padding: number;
  dataset: DSVParsedArray<DSVRowString>;
}

const AttributeRow: FC<AttributeRowProps> = ({
  store,
  attributes,
  element,
  height,
  width,
  padding,
  dataset
}: AttributeRowProps) => {
  const { visibleAttributes } = store!;

  function attributeVisualization(
    name: string,
    renderType: AttributeVisualizationType,
    values: number[],
    scale: ScaleLinear<number, number>
  ) {
    if (renderType === 'Dot') {
      return <DotPlot height={height} width={width} values={values} scale={scale} />;
    } else if (renderType === 'Box') {
      return (
        <BoxPlot
          name={name}
          height={height}
          width={width}
          values={values}
          stats={getStats(values)}
          scale={scale}
        />
      );
    } else {
      return <KDEPlot height={height} width={width} values={values} scale={scale} />;
    }
  }

  const attributeMaps = attributes.map((attr, idx) => {
    const attributeName = attr.name;
    const renderType = visibleAttributes[attributeName];
    const values = element.itemMembership.map(i => {
      if (attr.type === 'integer') {
        return parseInt(dataset[i][attributeName] || '0', 10);
      } else {
        return parseFloat(dataset[i][attributeName] || '0');
      }
    });

    const scale = scaleLinear()
      .domain([attr.min || 0, attr.max || 0])
      .range([0, width]);

    return (
      <g key={attr.name} transform={translate((padding + width) * idx, 0)}>
        {attributeVisualization(element.elementName, renderType, values, scale)}
      </g>
    );
  });

  return <g transform={translate(padding, 0)}>{attributeMaps}</g>;
};

export default pure(inject('store')(observer(AttributeRow)));
