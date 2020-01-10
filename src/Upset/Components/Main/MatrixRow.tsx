import React, { FC } from 'react';
import { inject, observer } from 'mobx-react';
import SubsetRow from './MatrixRows/SubsetRow';
import { Subset } from '../../Interfaces/UpsetDatasStructure/Subset';
import RowType from '../../Interfaces/UpsetDatasStructure/RowType';
import { BaseElement } from '../../Interfaces/UpsetDatasStructure/BaseElement';
import GroupRow from './MatrixRows/GroupRow';
import { Group } from '../../Interfaces/UpsetDatasStructure/Group';

interface Props {
  row_id: string;
  rowHeight: number;
  rowWidth: number;
  element: BaseElement;
  elementType: RowType;
  offset: number;
}

const MatrixRow: FC<Props> = ({
  row_id,
  rowHeight,
  rowWidth,
  element,
  elementType,
  offset
}: Props) => {
  let renderedRow = <g></g>;

  switch (elementType) {
    case 'Group':
      const group: Group = element as any;
      renderedRow = (
        <GroupRow id={row_id} height={rowHeight} width={rowWidth} element={group}></GroupRow>
      );
      break;
    case 'Subset':
      const subset: Subset = element as any;
      renderedRow = (
        <g transform={`translate(${offset}, 0)`}>
          <SubsetRow id={row_id} height={rowHeight} width={rowWidth} element={subset}></SubsetRow>
        </g>
      );
      break;
    default:
      break;
  }

  return <>{renderedRow}</>;
};

export default inject('store')(observer(MatrixRow));
