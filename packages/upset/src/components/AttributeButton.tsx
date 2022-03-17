/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../atoms/dimensionsAtom';
import translate from '../utils/transform';

type Props = {
  label: string;
  sort?: boolean;
};

export const AttributeButton: FC<Props> = ({ label, sort = false }) => {
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
        height={dimensions.attribute.buttonHeight}
        width={dimensions.attribute.width}
      />
      <text
        css={
          sort &&
          css`
            pointer-event: none;
            cursor: s-resize;
          `
        }
        dominantBaseline="middle"
        transform={translate(
          dimensions.attribute.width / 2,
          dimensions.attribute.buttonHeight / 2,
        )}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
};
