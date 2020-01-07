import React, { FC } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { RenderRows, RenderRow } from '../../Interfaces/UpsetDatasStructure/Data';
import { Sets } from '../../Interfaces/UpsetDatasStructure/Set';
import { selectAll } from 'd3';
import { style } from 'typestyle';
import { NodeGroup } from 'react-move';
import { BaseSet } from '../../Interfaces/UpsetDatasStructure/BaseSet';
import MatrixRow from './MatrixRow';

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

interface BaseAnimationProps {
  y: number | number[];
  opacity: number;
  timing: { duration: number };
}

export type AnimationProps = Partial<BaseAnimationProps>;

const Matrix: FC<Props> = ({
  className,
  totalWidth,
  totalHeight,
  offset,
  matrixColWidth,
  renderRows,
  rowHeight,
  usedSets
}: Props) => {
  const enter = (_: RenderRow, i: number): AnimationProps => {
    return { y: i * rowHeight };
  };

  const start = (_: RenderRow, i: number): AnimationProps => {
    return { y: i * rowHeight, opacity: 0 };
  };

  const update = (_: RenderRow, i: number): AnimationProps => {
    return { y: [i * rowHeight], opacity: 1, timing: { duration: 250 } };
  };

  const leave = (_: RenderRow, i: number): AnimationProps => {
    return { y: [-i * rowHeight], opacity: 0, timing: { duration: 250 } };
  };

  return (
    <svg className={className} height={totalHeight} width={totalWidth}>
      <g transform={`translate(${offset}, 0)`}>
        {/* Two for background column highlight */}
        {usedSets.map((set, colIdx) => (
          <rect
            key={set.id}
            className={set.id}
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
        {/* This is for rows */}
        <NodeGroup
          keyAccessor={row => row.id}
          data={renderRows}
          start={start}
          enter={enter}
          update={update}
          leave={leave}
        >
          {rows => {
            return (
              <g>
                {rows.map(row => {
                  const { data, key, state } = row;
                  const element = data.element as BaseSet;
                  return (
                    <g key={key} transform={`translate(0, ${state.y})`}>
                      <MatrixRow
                        row_id={key}
                        rowHeight={rowHeight}
                        rowWidth={matrixColWidth}
                        element={element}
                      ></MatrixRow>
                    </g>
                  );
                })}
              </g>
            );
          }}
        </NodeGroup>
      </g>
    </svg>
  );
};

export default inject('store')(observer(Matrix));

const highlight = style({
  fill: '#fed9a6 !important'
});
