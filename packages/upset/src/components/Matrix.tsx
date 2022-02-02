/** @jsxImportSource @emotion/react */
import { Subset } from '@visdesignlab/upset2-core';
import React, { FC, useContext } from 'react';
import { css } from '@emotion/react';
import translate from '../utils/transform';
import { UpsetContext } from '../context/UpsetContext';

type Props = {
  subset: Subset;
  sets: string[];
};

const isNotMember = css`
  fill: #f0f0f0;
`;

const isMember = css`
  fill: #636363;
`;

export const Matrix: FC<Props> = ({ subset, sets = [] }) => {
  const { dimensions } = useContext(UpsetContext);

  const membership = sets.map((s) => subset.setMembership[s]);
  const memberCount = membership.filter((v) => v === 'Yes').length;

  let firstMember = 0;
  let lastMember = 0;

  if (memberCount > 0) firstMember = membership.indexOf('Yes');

  if (memberCount > 1) lastMember = membership.lastIndexOf('Yes');

  return (
    <g transform={translate(dimensions.header.matrixColumn.labelHeight, 0)}>
      <g transform={translate(dimensions.header.matrixColumn.barWidth / 2, 0)}>
        {sets.map((set, idx) => {
          const membershipStatus = subset.setMembership[set];

          return (
            <circle
              css={css`
                ${membershipStatus !== 'No' ? isMember : isNotMember}
              `}
              key={set}
              r={
                membershipStatus === 'May'
                  ? '4'
                  : (dimensions.header.matrixColumn.barWidth - 2) / 2
              }
              cx={idx * dimensions.header.matrixColumn.barWidth}
              cy={dimensions.body.rowHeight / 2}
            />
          );
        })}
        {memberCount > 1 && (
          <line
            css={css`
              stroke: #636363;
            `}
            x1={firstMember * dimensions.header.matrixColumn.barWidth}
            x2={lastMember * dimensions.header.matrixColumn.barWidth}
            y1={dimensions.body.rowHeight / 2}
            y2={dimensions.body.rowHeight / 2}
            strokeWidth="3"
          />
        )}
      </g>
    </g>
  );
};
