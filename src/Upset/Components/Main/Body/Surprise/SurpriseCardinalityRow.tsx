import React, { FC } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { BaseElement } from '../../../../Interfaces/UpsetDatasStructure/BaseElement';
import RowType from '../../../../Interfaces/UpsetDatasStructure/RowType';
import { ScaleLinear, selectAll } from 'd3';
import { inject, observer } from 'mobx-react';
import { style } from 'typestyle';
import highlight from '../../HighlightedStyle';
import { Subset } from '../../../../Interfaces/UpsetDatasStructure/Subset';
import { Group } from '../../../../Interfaces/UpsetDatasStructure/Group';

interface Props {
  store?: UpsetStore;
  id: number;
  element: BaseElement;
  elementType: RowType;
  width: number;
  height: number;
  padding: number;
  scale: ScaleLinear<number, number>;
}

const SurpriseCardinalityRow: FC<Props> = ({
  id,
  element,
  elementType,
  height,
  width,
  padding,
  scale
}: Props) => {
  const { size, disproportionality } = element as Subset | Group;
  const sign = disproportionality / Math.abs(disproportionality);
  const adjustedSize = size + sign * size * disproportionality;
  const fill = disproportionality > 0 ? 'blue' : 'red';

  if (scale(adjustedSize) < 0) {
    console.log(size, adjustedSize, disproportionality);
  }

  return (
    <g>
      <rect
        className={elementType === 'Group' ? groupRow : `R_${id}`}
        height={height}
        width={width + padding}
        pointerEvents="all"
        fill="none"
        onMouseOver={() => {
          selectAll(`.R_${id}`).classed(highlight, true);
        }}
        onMouseLeave={() => {
          selectAll(`.R_${id}`).classed(highlight, false);
        }}
      />
      <g transform={`translate(${padding}, 0)`}>
        <g transform={`translate(${scale(size)}, ${height / 2})`}>
          <line stroke={fill} y1={0} y2={10}></line>
        </g>
        <g transform={`translate(${scale(adjustedSize)}, ${height / 2})`}>
          <line stroke={fill} y1={0} y2={10}></line>
        </g>
      </g>
    </g>
  );
};

export default inject('store')(observer(SurpriseCardinalityRow));

const groupRow = style({
  fill: '#ccc',
  opacity: 0.3
});
