import React, { FC } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { BaseElement } from '../../../../Interfaces/UpsetDatasStructure/BaseElement';
import RowType from '../../../../Interfaces/UpsetDatasStructure/RowType';
import { ScaleLinear, selectAll } from 'd3';
import { Subset } from '../../../../Interfaces/UpsetDatasStructure/Subset';
import { Group } from '../../../../Interfaces/UpsetDatasStructure/Group';
import groupRow from '../../GroupStyle';
import highlight from '../../HighlightedStyle';
import translate from '../../../ComponentUtils/Translate';
import { pure } from 'recompose';

interface DeviationRowProps {
  store?: UpsetStore;
  id: number;
  element: BaseElement;
  elementType: RowType;
  width: number;
  height: number;
  padding: number;
  scale: ScaleLinear<number, number>;
}

const DeviationRow: FC<DeviationRowProps> = ({
  id,
  element,
  elementType,
  width,
  height,
  padding,
  scale
}: DeviationRowProps) => {
  const { disproportionality } = element as Subset | Group;
  const sign = Math.sign(disproportionality);

  const fill = sign < 0 ? '#f46d43' : '#74add1';

  const barHeight = height * 0.8;
  const barWidth = scale(Math.abs(disproportionality));

  return (
    <g>
      <rect
        className={elementType === 'Group' ? groupRow : `R_${id}`}
        height={height}
        width={width + padding}
        pointerEvents="all"
        fill="none"
        onMouseOver={() => {
          selectAll(`.R_${id}`).classed(highlight, true);
        }}
        onMouseLeave={() => {
          selectAll(`.R_${id}`).classed(highlight, false);
        }}
      ></rect>
      <g transform={translate(padding, (height - barHeight) / 2)}>
        <g transform={translate(width / 2, 0)}>
          <rect
            x={sign < 0 ? -1 * barWidth : 0}
            fill={fill}
            width={barWidth}
            height={barHeight}
          ></rect>
        </g>
      </g>
    </g>
  );
};

(DeviationRow as any).whyDidYouRender = true;
export default pure(inject('store')(observer(DeviationRow)));
