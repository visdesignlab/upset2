import { css } from '@emotion/react';
import { FC, useContext } from 'react';
import { useRecoilValue } from 'recoil';

import translate from '../utils/transform';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { ProvenanceContext } from './Root';
import { currentIntersectionSelector } from '../atoms/config/currentIntersectionAtom';
import { calculateDimensions } from '../dimensions';
import { queryBySetsInterfaceAtom } from '../atoms/config/queryBySetsAtoms';
import { activeSelectionSelector } from '../atoms/elementsSelectors';

export const SvgBase: FC = ({ children }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const { actions } = useContext(ProvenanceContext);
  const selectedIntersection = useRecoilValue(currentIntersectionSelector);
  const activeSelection = useRecoilValue(activeSelectionSelector);
  const queryBySetsInterfaceOpen = useRecoilValue(queryBySetsInterfaceAtom);

  let { height } = dimensions;

  if ((dimensions as ReturnType<typeof calculateDimensions>)) {
    if (queryBySetsInterfaceOpen) {
      height += dimensions.setQuery.height + dimensions.setQuery.spacer;
    }
  }

  return (
    // These rules are for accessibility; unnecessary here as the plot is not accessible anyway.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      css={css`
        height: 100%;
        width: 100%;
      `}
      onClick={() => {
        if (selectedIntersection != null) actions.setSelected(null);
        if (activeSelection === 'row') actions.setActiveSelection(null);
      }}
    >
      <svg id="upset-svg" height={height + 50 * dimensions.margin} width={dimensions.width + 2 * dimensions.margin} xmlns="http://www.w3.org/2000/svg" version="1.1" baseProfile="full" fontFamily="Roboto, Arial">
        <g transform={translate(dimensions.margin)}>
          <rect
            height={height}
            width={dimensions.width}
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
