/** @jsxImportSource @emotion/react */
import '@fortawesome/fontawesome-free/css/all.css';

import { css } from '@emotion/react';
import React, { FC } from 'react';

import translate from '../utils/transform';

type SvgBaseSettings = {
  margin?: number;
  height?: number;
  width?: number;
};

type Props = {
  defaultSettings?: SvgBaseSettings;
};

export const SvgBase: FC<Props> = ({ children, defaultSettings = {} }) => {
  const { margin = 0, height = 0, width = 0 } = defaultSettings;

  return (
    <div
      css={css`
        height: 100%;
        width: 100%;
        text.icon {
          font-family: 'Font Awesome 5 Free';
          font-weight: 700;
          font-size: 12px;
        }
      `}
    >
      <svg height={height + 2 * margin} width={width + 2 * margin}>
        <g transform={translate(margin)}>
          <rect
            height={height}
            width={width}
            fill="none"
            stroke="black"
            opacity="0.2"
          />
          {children}
        </g>
      </svg>
    </div>
  );
};
