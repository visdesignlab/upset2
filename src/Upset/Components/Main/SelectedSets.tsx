import React, { FC, useContext } from 'react';
import { UpsetStore } from '../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { Sets } from '../../Interfaces/UpsetDatasStructure/Set';
import { style } from 'typestyle';
import { scaleLinear, selectAll } from 'd3';
import { ProvenanceContext, SizeContext } from '../../Upset';
import highlight from './HighlightedStyle';
import translate from '../ComponentUtils/Translate';
import { Dropdown } from 'semantic-ui-react';

interface Props {
  store?: UpsetStore;
  className: string;
  usedSets: Sets;
  unusedSets: Sets;
  maxSetSize: number;
  sortedSetName: string;
}

const SelectedSets: FC<Props> = ({
  className,
  usedSets,
  maxSetSize,
  sortedSetName,
  unusedSets
}: Props) => {
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

  const removeCircleRadius = 5;

  return (
    <div className={parentDiv}>
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
              <g transform={`translate(${i * columnWidth}, 0)`}>
                <rect
                  className={set.id}
                  fill="#f0f0f0"
                  height={headerBarHeight}
                  width={columnWidth}
                ></rect>
                <rect
                  fill="#636363"
                  stroke="white"
                  strokeWidth={1}
                  key={set.id}
                  height={heightScale(set.size)}
                  width={columnWidth}
                  y={headerBarHeight - heightScale(set.size)}
                ></rect>
                {usedSets.length > 2 && (
                  <g
                    transform={translate(columnWidth / 2, removeCircleRadius * 2)}
                    onClick={() => {
                      actions.removeSet(set.elementName);
                    }}
                  >
                    <text
                      className={hoverShow}
                      fill="white"
                      stroke="black"
                      cursor="pointer"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fontSize="0.9em"
                      fontFamily="FontAwesome"
                      opacity="0.01"
                    >
                      &#xf1f8;
                    </text>
                  </g>
                )}
              </g>
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
              cursor="s-resize"
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
      <div key={unusedSets.length} className={addSetsDiv(columnWidth * (usedSets.length * 1.1))}>
        <Dropdown
          text="Add set"
          search
          options={unusedSets.map(set => ({
            key: set.id,
            text: set.elementName,
            value: set.elementName
          }))}
          onChange={(_, data) => {
            const selection = data.value;
            if (selection) {
              actions.addSet(selection as string);
            }
          }}
          selectOnBlur={false}
        ></Dropdown>
      </div>
    </div>
  );
};

export default inject('store')(observer(SelectedSets));

const parentDiv = style({
  position: 'relative'
});

const addSetsDiv = (offset: number = 0) => {
  return style({
    position: 'absolute',
    top: 0,
    left: offset
  });
};
const highlightSorted = style({
  fill: '#d0d0d0 !important'
});

const hoverShow = style({
  $nest: {
    '&:hover': {
      opacity: 1
    }
  }
});
