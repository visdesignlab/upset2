import React, { FC } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { RenderRows } from '../../Interfaces/UpsetDatasStructure/Data';
import { Sets } from '../../Interfaces/UpsetDatasStructure/Set';
import { selectAll } from 'd3';
import { NodeGroup } from 'react-move';
import MatrixRow from './MatrixRow';
import { BaseElement } from '../../Interfaces/UpsetDatasStructure/BaseElement';
import { getRowTransitions } from './RowTransitions';
import highlight from './HighlightedStyle';

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
  className,
  totalWidth,
  totalHeight,
  offset,
  matrixColWidth,
  renderRows,
  rowHeight,
  usedSets
}: Props) => {
  const { start, enter, leave, update } = getRowTransitions(rowHeight);

  return (
    <svg className={className} height={totalHeight} width={totalWidth}>
      <g>
        {/* Two for background column highlight */}
        <g transform={`translate(${offset}, 0)`}>
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
        </g>
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
                  const element = data.element as BaseElement;
                  return (
                    <g key={key} transform={`translate(0, ${state.y})`}>
                      <MatrixRow
                        row_id={key}
                        rowHeight={rowHeight}
                        rowWidth={matrixColWidth + offset}
                        element={element}
                        elementType={element.type}
                        offset={offset}
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
