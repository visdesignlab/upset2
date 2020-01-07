import React, { FC } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { RenderRows } from '../../Interfaces/UpsetDatasStructure/Data';
import { Subset } from '../../Interfaces/UpsetDatasStructure/Subset';
import { Sets } from '../../Interfaces/UpsetDatasStructure/Set';
import { selectAll } from 'd3';
import { style } from 'typestyle';

interface Props {
  store?: UpsetStore;
  className: string;
  totalWidth: number;
  totalHeight: number;
  offset: number;
  matrixColWidth: number;
  usedSets: Sets;
  renderRows: RenderRows;
  rowHeight: number;
}

const Matrix: FC<Props> = ({
  store,
  className,
  totalWidth,
  totalHeight,
  offset,
  matrixColWidth,
  renderRows,
  rowHeight,
  usedSets
}: Props) => {
  console.log(renderRows);
  return (
    <svg className={className} height={totalHeight} width={totalWidth}>
      <g transform={`translate(${offset}, 0)`}>
        {usedSets.map((set, colIdx) => (
          <rect
            key={set.id}
            height={totalHeight}
            width={matrixColWidth / usedSets.length}
            x={(colIdx * matrixColWidth) / usedSets.length}
            fill="none"
            pointerEvents="all"
            onMouseOver={() => {
              selectAll(`.${set.id}`).classed(highlight, true);
            }}
            onMouseLeave={() => {
              selectAll(`.${set.id}`).classed(highlight, false);
            }}
          ></rect>
        ))}
        {usedSets.map((set, colIdx) => (
          <rect
            key={set.id}
            className={set.id}
            height={totalHeight}
            width={matrixColWidth / usedSets.length}
            x={(colIdx * matrixColWidth) / usedSets.length}
            fill="none"
            onMouseOver={() => {
              selectAll(`.${set.id}`).classed(highlight, true);
            }}
            onMouseLeave={() => {
              selectAll(`.${set.id}`).classed(highlight, false);
            }}
          ></rect>
        ))}
        {renderRows.map(({ id, element }, i) => {
          const combinedSets = [...(element as Subset).combinedSets];

          const linePresent = combinedSets.filter(c => c === 1).length > 1;

          let [first, last] = [0, 0];

          if (linePresent) {
            first = combinedSets.findIndex(c => c === 1);
            last = combinedSets.length - 1 - combinedSets.reverse().findIndex(c => c === 1);
            console.log(combinedSets, first, last);
          }

          return (
            <g key={id} transform={`translate(0, ${i * rowHeight})`}>
              <rect
                className={`R_${id}`}
                height={rowHeight}
                width={matrixColWidth}
                stroke="white"
                strokeWidth={1}
                fill="none"
                pointerEvents="all"
                onMouseOver={() => {
                  selectAll(`.R_${id}`).classed(highlight, true);
                }}
                onMouseLeave={() => {
                  selectAll(`.R_${id}`).classed(highlight, false);
                }}
              ></rect>
              {(element as Subset).combinedSets.map((membership, idx) => (
                <g
                  key={idx}
                  onMouseOver={() => {
                    selectAll(`.S_${idx}`).classed(highlight, true);
                    selectAll(`.R_${id}`).classed(highlight, true);
                  }}
                  onMouseLeave={() => {
                    selectAll(`.S_${idx}`).classed(highlight, false);
                    selectAll(`.R_${id}`).classed(highlight, false);
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
            </g>
          );
        })}
      </g>
    </svg>
  );
};

export default inject('store')(observer(Matrix));

const highlight = style({
  fill: '#fed9a6 !important'
});
