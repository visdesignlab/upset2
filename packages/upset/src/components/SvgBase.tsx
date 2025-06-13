import { css } from '@emotion/react';
import { FC, useContext } from 'react';
import { useRecoilValue } from 'recoil';

import translate from '../utils/transform';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { ProvenanceContext } from './Root';
import { currentIntersectionSelector } from '../atoms/config/selectionAtoms';
import { queryBySetsInterfaceAtom } from '../atoms/config/queryBySetsAtoms';
import { UpsetActions } from '../provenance';

export const SvgBase: FC = ({ children }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const { actions }: { actions: UpsetActions } = useContext(ProvenanceContext);
  const selectedIntersection = useRecoilValue(currentIntersectionSelector);
  const queryBySetsInterfaceOpen = useRecoilValue(queryBySetsInterfaceAtom);

  let { height } = dimensions;

  if (dimensions) {
    if (queryBySetsInterfaceOpen) {
      height += dimensions.setQuery.height + dimensions.setQuery.spacer;
    }
  }

  return (
    // These rules are for accessibility; unnecessary here as the plot is not accessible anyway.
    <div
      css={css`
        height: 100%;
        width: 100%;
      `}
      onClick={() => {
        if (selectedIntersection !== null) actions.setRowSelection(null);
      }}
    >
      <svg
        id="upset-svg"
        height={height + 50 * dimensions.margin}
        width={dimensions.width + 2 * dimensions.margin}
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        baseProfile="full"
        fontFamily="Roboto, Arial"
      >
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
