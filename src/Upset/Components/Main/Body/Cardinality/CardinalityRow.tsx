import React, { FC } from 'react';
import { BaseElement } from '../../../../Interfaces/UpsetDatasStructure/BaseElement';
import RowType from '../../../../Interfaces/UpsetDatasStructure/RowType';
import { selectAll, ScaleLinear } from 'd3';
import { style } from 'typestyle';
import highlight from '../../HighlightedStyle';
import { Subset } from '../../../../Interfaces/UpsetDatasStructure/Subset';
import { Group } from '../../../../Interfaces/UpsetDatasStructure/Group';
import { inject, observer } from 'mobx-react';
import { pure } from 'recompose';

interface Props {
  id: number;
  element: BaseElement;
  elementType: RowType;
  width: number;
  height: number;
  padding: number;
  scale: ScaleLinear<number, number>;
}

const CardinalityRow: FC<Props> = ({
  id,
  element,
  elementType,
  height,
  width,
  padding,
  scale
}: Props) => {
  const barWidth = scale(element.size);
  let requiredBars = Math.floor(barWidth / width) + 1;
  let remainderLength = barWidth % width;

  const reduceFactor = 0.5;

  let barHeight = height * 0.8;

  let backgroundBars = [<></>];

  const colors = ['#bdbdbd', '#888888', '#252525'];
  const { disproportionality, size } = element as Subset | Group;

  const sign = disproportionality / Math.abs(disproportionality);
  const adjustedSize = size + sign * size * disproportionality;
  const adjustedWidth = scale(adjustedSize);
  const adjustedRemainder = adjustedWidth % width;

  if (requiredBars > 3) {
    backgroundBars = [...new Array(3).keys()].map(key => {
      const newHeight = barHeight;
      barHeight = barHeight * reduceFactor;
      return (
        <rect
          key={key}
          transform={`translate(0, ${(height - newHeight) / 2})`}
          fill={colors[key]}
          width={width}
          height={newHeight}
        ></rect>
      );
    });
    backgroundBars.push(
      <g key="break">
        <line
          key="break-1"
          stroke="white"
          strokeWidth="2"
          x1={width * 0.9}
          x2={width * 0.93}
          y1={0}
          y2={height * 0.9}
        ></line>
        <line
          key="break-2"
          stroke="white"
          strokeWidth="2"
          x1={width * 0.92}
          x2={width * 0.95}
          y1={0}
          y2={height * 0.9}
        ></line>
      </g>
    );
  } else {
    backgroundBars = [...new Array(requiredBars).keys()].map(key => {
      const col = colors[key];
      if (key + 1 === requiredBars) {
        return (
          <g key={key}>
            <rect
              transform={`translate(0, ${(height - barHeight) / 2})`}
              fill={col}
              width={remainderLength}
              height={barHeight}
            ></rect>
            <circle cx={adjustedRemainder} r={2} cy={height / 2}></circle>
          </g>
        );
      }
      const newHeight = barHeight;
      barHeight = barHeight * reduceFactor;
      return (
        <rect
          key={key}
          transform={`translate(0, ${(height - newHeight) / 2})`}
          fill={col}
          width={width}
          height={newHeight}
        ></rect>
      );
    });
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
      ></rect>
      <g transform={`translate(${padding}, 0)`} pointerEvents="none">
        {backgroundBars}
        <text
          fill={requiredBars > 2 ? 'white' : 'black'}
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`translate(${width / 2}, ${height / 2})`}
        >
          {element.size}
        </text>
      </g>
    </g>
  );
};

export default pure(inject('store')(observer(CardinalityRow)));

const groupRow = style({
  fill: '#ccc',
  opacity: 0.3
});
