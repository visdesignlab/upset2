import React, { FC } from 'react';
import { UpsetStore } from '../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { Group } from '../../../Interfaces/UpsetDatasStructure/Group';
import ExpandCollapseSymbols from '../ExpandCollapseSymbols';

interface Props {
  store?: UpsetStore;
  id: string;
  height: number;
  width: number;
  element: Group;
}

const GroupRow: FC<Props> = ({ id, height, width, element }: Props) => {
  const { expanded } = ExpandCollapseSymbols;
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

      <text dominantBaseline="middle" transform={`translate(5, ${height / 2})`}>
        {expanded} {element.elementName}
      </text>
    </>
  );
};

export default inject('store')(observer(GroupRow));
