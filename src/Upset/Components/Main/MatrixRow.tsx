import React, { FC } from 'react';
import { inject, observer } from 'mobx-react';
import { style } from 'typestyle';
import { selectAll } from 'd3';
import { BaseSet } from '../../Interfaces/UpsetDatasStructure/BaseSet';

interface Props {
  row_id: string;
  rowHeight: number;
  rowWidth: number;
  element: BaseSet;
}

const MatrixRow: FC<Props> = ({ row_id, rowHeight, rowWidth, element }: Props) => {
  const combinedSets = [...element.combinedSets];
  const linePresent = combinedSets.filter(c => c === 1).length > 1;
  let [first, last] = [0, 0];
  if (linePresent) {
    first = combinedSets.findIndex(c => c === 1);
    last = combinedSets.length - 1 - combinedSets.reverse().findIndex(c => c === 1);
  }

  return (
    <>
      <rect
        className={`R_${row_id}`}
        height={rowHeight}
        width={rowWidth}
        stroke="white"
        strokeWidth={1}
        fill="none"
        pointerEvents="all"
        onMouseOver={() => {
          selectAll(`.R_${row_id}`).classed(highlight, true);
          element.combinedSets.forEach((mem, i) => {
            if (mem === 1) selectAll(`.S_${i}`).classed(highlight, true);
          });
        }}
        onMouseLeave={() => {
          selectAll(`.R_${row_id}`).classed(highlight, false);
          element.combinedSets.forEach((_, i) => selectAll(`.S_${i}`).classed(highlight, false));
        }}
      ></rect>
      {element.combinedSets.map((membership, idx) => (
        <g
          key={idx}
          onMouseOver={() => {
            selectAll(`.S_${idx}`).classed(highlight, true);
            element.combinedSets.forEach((mem, i) => {
              if (mem === 1) selectAll(`.S_${i}`).classed(highlight, true);
            });
            selectAll(`.R_${row_id}`).classed(highlight, true);
          }}
          onMouseLeave={() => {
            selectAll(`.S_${idx}`).classed(highlight, false);
            selectAll(`.R_${row_id}`).classed(highlight, false);
            element.combinedSets.forEach((_, i) => selectAll(`.S_${i}`).classed(highlight, false));
          }}
        >
          <g transform={`translate(${idx * 20 + 10}, 10)`}>
            {membership === 0 ? (
              <circle r="8" fill="#f0f0f0"></circle>
            ) : (
              <circle r="8" fill="#636363"></circle>
            )}
          </g>
        </g>
      ))}

      {linePresent && (
        <line
          x1={first * 20 + 10}
          x2={last * 20 + 10}
          y1={10}
          y2={10}
          strokeWidth={5}
          stroke="#636363"
        ></line>
      )}
    </>
  );
};

export default inject('store')(observer(MatrixRow));

const highlight = style({
  fill: '#fed9a6 !important'
});
