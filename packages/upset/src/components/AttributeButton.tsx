/** @jsxImportSource @emotion/react */
import React, { FC } from 'react';
import { css } from '@emotion/react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import translate from '../utils/transform';

type Props = {
  label: string;
};

export const AttributeButton: FC<Props> = ({ label }) => {
  const dimensions = useRecoilValue(dimensionsSelector);

  return (
    <g>
      <rect
        css={css`
          fill: #ccc;
          stroke: black;
          opacity: 0.5;
          stroke-width: 0.3px;
        `}
        height={dimensions.header.attribute.buttonHeight}
        width={dimensions.header.attribute.width}
      />
      <text
        css={css`
          pointer-event: none;
          cursor: s-resize;
        `}
        dominantBaseline="middle"
        transform={translate(
          dimensions.header.attribute.width / 2,
          dimensions.header.attribute.buttonHeight / 2,
        )}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
};
