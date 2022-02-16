/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { Aggregate } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { visibleSetsAtom } from '../atoms/setsAtoms';
import translate from '../utils/transform';
import { CardinalityBar } from './CardinalityBars';
import { DeviationBar } from './DeviationBars';
import { Matrix } from './Matrix';

type Props = {
  aggregateRow: Aggregate;
};

export const AggregateRow: FC<Props> = ({ aggregateRow }) => {
  const visibleSets = useRecoilValue(visibleSetsAtom);
  const dimensions = useRecoilValue(dimensionsSelector);

  let width = dimensions.body.rowWidth;
  if (aggregateRow.level === 2) {
    width -= dimensions.body.aggregateOffset;
  }

  return (
    <>
      <rect
        transform={translate(aggregateRow.level === 2 ? 15 : 2, 2)}
        css={css`
          fill: #cccccc;
          opacity: 0.3;
          stroke: #555555;
          stroke-width: 1px;
        `}
        height={dimensions.body.rowHeight - 4}
        width={width}
        rx={5}
        ry={10}
      />
      <Matrix sets={visibleSets} subset={aggregateRow as any} />
      <CardinalityBar size={aggregateRow.size} />
      <DeviationBar deviation={aggregateRow.deviation} />
    </>
  );
};
