import React, { FC } from 'react';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { AttributeRenderRow } from '../../../../Interfaces/UpsetDatasStructure/Data';
import { ScaleLinear, selectAll } from 'd3';
import groupRow from '../../GroupStyle';
import highlight from '../../HighlightedStyle';
import DotPlot from './DotPlot';
import translate from '../../../ComponentUtils/Translate';
import BoxPlot from './BoxPlot';

export type AttributeVisualizationType = 'Dot' | 'KDE' | 'Box';

export const AttributeVisualizationTypeMap: {
  [key: string]: AttributeVisualizationType;
} = {
  Dot: 'Dot',
  KDE: 'KDE',
  Box: 'Box'
};

interface AttributeRowProps {
  store?: UpsetStore;
  id: number;
  renderRow: AttributeRenderRow;
  width: number;
  height: number;
  padding: number;
  renderType: AttributeVisualizationType;
  scale: ScaleLinear<number, number>;
}

const AttributeRow: FC<AttributeRowProps> = ({
  id,
  renderRow,
  width,
  height,
  padding,
  scale,
  renderType
}: AttributeRowProps) => {
  const { element, values, stats } = renderRow;
  const type = element.type;

  let plot = <></>;

  switch (renderType) {
    case 'Dot':
      plot = <DotPlot height={height} width={width} values={values} scale={scale} />;
      break;
    case 'Box':
      plot = (
        <BoxPlot
          name={element.elementName}
          height={height}
          width={width}
          values={values}
          stats={stats}
          scale={scale}
        />
      );
      break;
    case 'KDE':
    default:
      plot = <></>;
  }

  return (
    <g>
      <rect
        className={type === 'Group' ? groupRow : `R_${id}`}
        height={height}
        width={padding + width}
        pointerEvents="all"
        fill="none"
        onMouseOver={() => {
          selectAll(`.R_${id}`).classed(highlight, true);
        }}
        onMouseLeave={() => {
          selectAll(`.R_${id}`).classed(highlight, false);
        }}
      ></rect>
      <g transform={translate(padding, 0)}>{plot}</g>
    </g>
  );
};

export default inject('store')(observer(AttributeRow));
