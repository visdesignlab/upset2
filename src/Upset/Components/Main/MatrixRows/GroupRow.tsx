import React, { FC } from 'react';
import { UpsetStore } from '../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { Group } from '../../../Interfaces/UpsetDatasStructure/Group';
import ExpandCollapseSymbols from '../ExpandCollapseSymbols';
import { style } from 'typestyle';
import { Popup } from 'semantic-ui-react';
import { selectAll } from 'd3';
import highlight from '../HighlightedStyle';

interface Props {
  store?: UpsetStore;
  id: string;
  height: number;
  width: number;
  element: Group;
  offset: number;
}

const GroupRow: FC<Props> = ({ id, height, width, element, offset }: Props) => {
  const { expanded } = ExpandCollapseSymbols;

  let membership = [<></>];

  const showMembership = element.aggregatedBy === 'Sets' || element.aggregatedBy === 'Overlaps';
  const aggregationlevel = element.level;

  if (showMembership) {
    if (aggregationlevel === 1) {
      const { setMembership = [] } = element;
      const isEmptySet = !setMembership.includes(1);
      membership = setMembership.map((mem, idx) => {
        return (
          <g
            key={idx}
            onMouseOver={() => {
              selectAll(`.S_${idx}`).classed(highlight, true);
              setMembership.forEach((mem, i) => {
                if (mem === 1) selectAll(`.S_${i}`).classed(highlight, true);
              });
            }}
            onMouseLeave={() => {
              selectAll(`.S_${idx}`).classed(highlight, false);
              setMembership.forEach((_, i) => selectAll(`.S_${i}`).classed(highlight, false));
            }}
          >
            <g transform={`translate(${idx * 20 + 10}, 10)`}>
              {mem ? (
                <circle r="8" fill="#636363"></circle>
              ) : isEmptySet ? (
                <circle r="8" fill="#F0F0F0" stroke="black"></circle>
              ) : (
                <>
                  <circle r="8" fill="#F0F0F0"></circle>
                  <circle r="3" fill="#636363"></circle>
                </>
              )}
            </g>
          </g>
        );
      });
    } else if (aggregationlevel === 2) {
    }
  }

  let groupName = element.elementName;

  if (showMembership) {
    if (aggregationlevel === 1) {
      groupName = groupName.length > 10 ? groupName.substr(0, 10) + '...' : groupName;
    }
  }

  return (
    <>
      <rect
        className={`R_${id}`}
        height={height}
        width={width}
        fill="#ccc"
        opacity="0.3"
        pointerEvents="all"
      ></rect>
      {showMembership && <g transform={`translate(${offset}, 0)`}>{membership}</g>}
      <Popup
        trigger={
          <text dominantBaseline="middle" transform={`translate(5, ${height / 2})`}>
            <tspan className={small}>{expanded}</tspan> {groupName}
          </text>
        }
        content={element.elementName}
      ></Popup>
    </>
  );
};

export default inject('store')(observer(GroupRow));

const small = style({
  fontSize: '0.5em'
});
