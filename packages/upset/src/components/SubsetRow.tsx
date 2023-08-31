import { Subset, getBelongingSetsFromSetMembership } from '@visdesignlab/upset2-core';
import React, { FC, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { AttributeBars } from './AttributeBars';
import { SizeBar } from './SizeBar';
import { DeviationBar } from './DeviationBar';
import { Matrix } from './Matrix';
import { bookmarkedIntersectionSelector, currentIntersectionAtom } from '../atoms/config/currentIntersectionAtom';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import {
  highlight, defaultBackground, mousePointer, hoverHighlight,
} from '../utils/styles';
import { BookmarkStar } from './custom/BookmarkStar';
import { columnHoverAtom, columnSelectAtom } from '../atoms/highlightAtom';

type Props = {
  subset: Subset;
};

export const SubsetRow: FC<Props> = ({ subset }) => {
  const visibleSets = useRecoilValue(visibleSetSelector);
  const currentIntersection = useRecoilValue(currentIntersectionAtom);
  const setCurrentIntersection = useSetRecoilState(currentIntersectionAtom);
  const dimensions = useRecoilValue(dimensionsSelector);
  const bookmarkedIntersections = useRecoilValue(bookmarkedIntersectionSelector);

  const setColumnHighlight = useSetRecoilState(columnHoverAtom);
  const setColumnSelect = useSetRecoilState(columnSelectAtom);

  const [hover, setHover] = useState<string | null>(null);

  return (
    <g
      onClick={
        () => {
          if (currentIntersection !== null && currentIntersection.id === subset.id) { // if the row is already selected, deselect it
            setCurrentIntersection(null);
            setColumnSelect([]);
            setHover(subset.id);
            setColumnHighlight(getBelongingSetsFromSetMembership(subset.setMembership));
          } else {
            setCurrentIntersection(subset);
            setColumnSelect(getBelongingSetsFromSetMembership(subset.setMembership));
          }
        }
      }
      onMouseEnter={
        () => {
          setHover(subset.id);
          setColumnHighlight(getBelongingSetsFromSetMembership(subset.setMembership));
        }
      }
      onMouseLeave={() => setHover(null)}
      css={mousePointer}
    >
      <rect
        height={dimensions.body.rowHeight}
        width={dimensions.body.rowWidth}
        css={
          currentIntersection !== null && currentIntersection.id === subset.id
            ? highlight
            : (hover === subset.id)
              ? hoverHighlight
              : defaultBackground
        }
        rx="5"
        ry="10"
        fillOpacity="0.0"
      />
      <Matrix sets={visibleSets} subset={subset} />
      {bookmarkedIntersections.find((b) => b.id === subset.id) &&
        <BookmarkStar row={subset} />}
      <SizeBar size={subset.size} row={subset} />
      <DeviationBar deviation={subset.deviation} />
      <AttributeBars attributes={subset.attributes} row={subset} />
    </g>
  );
};
