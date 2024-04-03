import { Subset, getBelongingSetsFromSetMembership, getDegreeFromSetMembership } from '@visdesignlab/upset2-core';
import { FC, useState, useContext } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { visibleSetSelector } from '../../atoms/config/visibleSetsAtoms';
import { AttributeBars } from '../Columns/Attribute/AttributeBars';
import { SizeBar } from '../Columns/SizeBar';
import { DeviationBar } from '../Columns/DeviationBar';
import { Matrix } from '../Columns/Matrix/Matrix';
import { bookmarkedIntersectionSelector, currentIntersectionSelector } from '../../atoms/config/currentIntersectionAtom';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import {
  highlight, defaultBackground, mousePointer, hoverHighlight,
} from '../../utils/styles';
import { BookmarkStar } from '../Columns/BookmarkStar';
import { columnHoverAtom, columnSelectAtom } from '../../atoms/highlightAtom';
import { Degree } from '../Columns/Degree';
import { ProvenanceContext } from '../Root';
import { Row } from '@visdesignlab/upset2-core';

type Props = {
  subset: Subset;
};

/**
 * A row in the upset plot that represents a subset.
 * @param subset The subset to display data for
 */
export const SubsetRow: FC<Props> = ({ subset }) => {
  const visibleSets = useRecoilValue(visibleSetSelector);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const bookmarkedIntersections = useRecoilValue(bookmarkedIntersectionSelector);

  // Use trrack action for current intersection
  const { actions } = useContext(
    ProvenanceContext,
  );
  /**
   * Sets the currently selected intersection and fires
   * a Trrack action to update the provenance graph.
   * @param inter intersection to select
   */
  function setCurrentIntersection(inter: Row | null) {
    actions.setSelected(inter);
  }

  const setColumnHighlight = useSetRecoilState(columnHoverAtom);
  const setColumnSelect = useSetRecoilState(columnSelectAtom);

  const [hover, setHover] = useState<string | null>(null);

  return (
    <g
      onClick={
        () => {
          if (currentIntersection?.id === subset.id) { // if the row is already selected, deselect it
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
      onMouseLeave={() => {
        setHover(null);
        setColumnHighlight([]);
      }}
      css={mousePointer}
    >
      <rect
        height={dimensions.body.rowHeight}
        width={dimensions.body.rowWidth}
        css={
          currentIntersection?.id === subset.id
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
      <Degree degree={getDegreeFromSetMembership(subset.setMembership)} />
      <SizeBar size={subset.size} row={subset} />
      <DeviationBar deviation={subset.deviation} />
      <AttributeBars attributes={subset.attributes} row={subset} />
    </g>
  );
};
