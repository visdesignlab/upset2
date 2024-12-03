import { css } from '@emotion/react';
import { FC, useContext } from 'react';
import { useRecoilValue } from 'recoil';

import translate from '../utils/transform';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { ProvenanceContext } from './Root';
import { currentIntersectionSelector } from '../atoms/config/currentIntersectionAtom';

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
  const { actions } = useContext(ProvenanceContext);
  const selectedIntersection = useRecoilValue(currentIntersectionSelector);

  return (
    // These rules are for accessibility; unnecessary here as the plot is not accessible anyway.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      css={css`
        height: 100%;
        width: 100%;
      `}
      onClick={() => { if (selectedIntersection != null) actions.setSelected(null); }}
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
