import { Subset } from '@visdesignlab/upset2-core';
import React, { FC, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { AttributeBars } from './AttributeBars';
import { CardinalityBar } from './CardinalityBar';
import { DeviationBar } from './DeviationBar';
import { Matrix } from './Matrix';
import { bookmarkedIntersectionSelector, currentIntersectionAtom } from '../atoms/config/currentIntersectionAtom';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { highlight, defaultBackground, mousePointer, hoverHighlight } from '../utils/styles';
import { BookmarkStar } from './BookmarkStar';

type Props = {
  subset: Subset;
};

export const SubsetRow: FC<Props> = ({ subset }) => {
  const visibleSets = useRecoilValue(visibleSetSelector);
  const currentIntersection = useRecoilValue(currentIntersectionAtom);
  const setCurrentIntersectionAtom = useSetRecoilState(currentIntersectionAtom);
  const dimensions = useRecoilValue(dimensionsSelector);
  const bookmarkedIntersections = useRecoilValue(bookmarkedIntersectionSelector);

  const [ hover, setHover ] = useState<string | null>(null);

  return (
    <g
      onClick={() => subset && (setCurrentIntersectionAtom(subset))}
      onMouseEnter={() => setHover(subset.id)}
      onMouseLeave={() => setHover(null)}
      css={mousePointer}
    >
      <rect height={dimensions.body.rowHeight} width={dimensions.body.rowWidth} 
        css={
          (hover === subset.id) ? hoverHighlight
          : (currentIntersection !== null && currentIntersection.id === subset.id)
            ? highlight
            : defaultBackground
        }
        rx="5" ry="10"></rect>
      <Matrix sets={visibleSets} subset={subset} />
      {bookmarkedIntersections.find((b) => b.id === subset.id) &&
        <BookmarkStar row={subset} />
      }
      <CardinalityBar size={subset.size} row={subset} />
      <DeviationBar deviation={subset.deviation} />
      <AttributeBars attributes={subset.attributes} />
    </g>
  );
};
