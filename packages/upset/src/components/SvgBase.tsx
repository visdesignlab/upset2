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
      `}
    >
      <svg id="upset-svg" height={height + 50 * margin} width={width + 2 * margin} xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" fontFamily="Roboto, Arial">
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
