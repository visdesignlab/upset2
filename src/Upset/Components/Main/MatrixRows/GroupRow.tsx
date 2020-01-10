import React, { FC } from 'react';
import { UpsetStore } from '../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { Group } from '../../../Interfaces/UpsetDatasStructure/Group';
import { style } from 'typestyle';
import { selectAll } from 'd3';

interface Props {
  store?: UpsetStore;
  id: string;
  height: number;
  width: number;
  element: Group;
}

const expanded = '▼';
const collapsed = '►';

const GroupRow: FC<Props> = ({ id, height, width, element }: Props) => {
  return (
    <>
      <rect
        className={`R_${id}`}
        height={height}
        width={width}
        fill="#ccc"
        // stroke="#555"
        // strokeWidth="2px"
        opacity="0.3"
        pointerEvents="all"
      ></rect>

      <text dominantBaseline="middle" transform={`translate(5, ${height / 2})`}>
        {expanded} {element.elementName}
      </text>
    </>
  );
};

export default inject('store')(observer(GroupRow));

const highlight = style({
  fill: '#fed9a6 !important'
});
