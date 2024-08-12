import { Subset, getBelongingSetsFromSetMembership, Row } from '@visdesignlab/upset2-core';
import {
  FC, useState, useContext,
} from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { visibleSetSelector } from '../../atoms/config/visibleSetsAtoms';
import { AttributeBars } from '../Columns/Attribute/AttributeBars';
import { SizeBar } from '../Columns/SizeBar';
import { Matrix } from '../Columns/Matrix/Matrix';
import { bookmarkSelector, currentIntersectionSelector } from '../../atoms/config/currentIntersectionAtom';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import {
  highlight, defaultBackground, mousePointer, hoverHighlight,
} from '../../utils/styles';
import { BookmarkStar } from '../Columns/BookmarkStar';
import { columnHoverAtom, columnSelectAtom } from '../../atoms/highlightAtom';
import { ProvenanceContext } from '../Root';
import { subsetSelectedCount } from '../../atoms/elementsSelectors';

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
  const bookmarks = useRecoilValue(bookmarkSelector);

  const selected = useRecoilValue(subsetSelectedCount(subset.id));

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
      id={subset.id}
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
      {bookmarks.find((b) => b.id === subset.id) &&
        <BookmarkStar row={subset} />}
      <SizeBar size={subset.size} row={subset} selected={selected} />
      <AttributeBars attributes={subset.attributes} row={subset} />
    </g>
  );
};
