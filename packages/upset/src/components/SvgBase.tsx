import '@fortawesome/fontawesome-free/css/all.css';

import { css } from '@emotion/react';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import translate from '../utils/transform';
import { dimensionsSelector } from '../atoms/dimensionsAtom';

/** @jsxImportSource @emotion/react */
type SvgBaseSettings = {
  margin: number;
  height: number;
  width: number;
};

type Props = {
  defaultSettings?: SvgBaseSettings;
};

export const SvgBase: FC<Props> = ({ children, defaultSettings }) => {
  const { height, width, margin } = defaultSettings || useRecoilValue(dimensionsSelector);

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
      <svg height={height + 50 * margin} width={width + 2 * margin}>
        <g transform={translate(margin)}>
          <rect
            height={height}
            width={width}
            fill="none"
            stroke="black"
            opacity="0"
          />
          {children}
        </g>
      </svg>
    </div>
  );
};
