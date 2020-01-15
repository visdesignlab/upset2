import React, { FC, useContext } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { Sets } from '../../Interfaces/UpsetDatasStructure/Set';
import { style } from 'typestyle';
import { scaleLinear, selectAll } from 'd3';
import { ProvenanceContext, SizeContext } from '../../Upset';
import highlight from './HighlightedStyle';

interface Props {
  store?: UpsetStore;
  className: string;
  usedSets: Sets;
  maxSetSize: number;
  sortedSetName: string;
}

const SelectedSets: FC<Props> = ({ className, usedSets, maxSetSize, sortedSetName }: Props) => {
  const {
    usedSetsHeader: {
      setSizeBarHeight: headerBarHeight,
      totalHeaderHeight: totalHeight,
      setLabelsHeight: headerLabelHeight,
      setLabelAngleDegrees: angle
    },
    matrix: { totalMatrixWidth: totalWidth, columnWidth }
  } = useContext(SizeContext);

  const heightScale = scaleLinear()
    .domain([0, maxSetSize])
    .range([0, headerBarHeight]);

  const { actions } = useContext(ProvenanceContext);

  return (
    <svg width={totalWidth} height={totalHeight} className={className}>
      <g className="header-group">
        {usedSets.map((set, i) => (
          <g
            key={set.id}
            onMouseOver={() => {
              selectAll(`.${set.id}`).classed(highlight, true);
            }}
            onMouseLeave={() => {
              selectAll(`.${set.id}`).classed(highlight, false);
            }}
          >
            <rect
              className={set.id}
              fill="#f0f0f0"
              height={headerBarHeight}
              width={columnWidth}
              x={i * columnWidth}
            ></rect>
            <rect
              fill="#636363"
              stroke="white"
              strokeWidth={1}
              key={set.id}
              height={heightScale(set.size)}
              width={columnWidth}
              x={i * columnWidth}
              y={headerBarHeight - heightScale(set.size)}
            ></rect>
          </g>
        ))}
      </g>
      <g transform={`translate(0, ${headerBarHeight})`} className="connector-group">
        {usedSets.map((set, i) => (
          <g
            key={set.id}
            transform={`translate(${i * columnWidth}, 0)`}
            onMouseOver={() => {
              selectAll(`.${set.id}`).classed(highlight, true);
            }}
            onMouseLeave={() => {
              selectAll(`.${set.id}`).classed(highlight, false);
            }}
          >
            <rect
              transform={`skewX(${angle})`}
              fill="#f0f0f0"
              height={headerLabelHeight}
              width={columnWidth}
              className={`${set.id} ${sortedSetName === set.elementName ? highlightSorted : ''}`}
              onClick={() => {
                actions.setSortBySet(set.elementName);
              }}
            ></rect>
            <text
              transform={`translate(${0.95 * (headerLabelHeight + columnWidth / 2)}, ${0.95 *
                headerLabelHeight})rotate(${angle})`}
              dominantBaseline="middle"
              textAnchor="end"
            >
              {set.elementName}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default inject('store')(observer(SelectedSets));

const highlightSorted = style({
  fill: '#d0d0d0 !important'
});
