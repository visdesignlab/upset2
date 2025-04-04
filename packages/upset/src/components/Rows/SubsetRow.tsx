import { Subset, getBelongingSetsFromSetMembership, Row } from '@visdesignlab/upset2-core';
import {
  FC, useContext,
} from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { visibleSetSelector } from '../../atoms/config/visibleSetsAtoms';
import { AttributeBars } from '../Columns/Attribute/AttributeBars';
import { SizeBar } from '../Columns/SizeBar';
import { Matrix } from '../Columns/Matrix/Matrix';
import { currentSelectionType, currentIntersectionSelector } from '../../atoms/config/selectionAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import {
  highlight, defaultBackground, mousePointer, hoverHighlight,
} from '../../utils/styles';
import { BookmarkColumnIcon } from '../Columns/BookmarkColumnIcon';
import { columnHoverAtom, columnSelectAtom, rowHoverAtom } from '../../atoms/highlightAtom';
import { ProvenanceContext } from '../Root';
import { subsetSelectedCount } from '../../atoms/elementsSelectors';
import { UpsetActions } from '../../provenance';

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
  const selectionType = useRecoilValue(currentSelectionType);
  const dimensions = useRecoilValue(dimensionsSelector);
  const vegaSelected = useRecoilValue(subsetSelectedCount({ id: subset.id, type: 'vega' }));
  const querySelected = useRecoilValue(subsetSelectedCount({ id: subset.id, type: 'query' }));
  const [hoveredRow, setHoveredRow] = useRecoilState(rowHoverAtom);

  // Use trrack action for current intersection
  const { actions }: {actions: UpsetActions} = useContext(
    ProvenanceContext,
  );
  /**
   * Sets the currently selected intersection and fires
   * a Trrack action to update the provenance graph.
   * @param inter intersection to select
   */
  function setCurrentIntersection(inter: Row | null) {
    actions.setRowSelection(inter);
    actions.setSelectionType('row');
  }

  const setColumnHighlight = useSetRecoilState(columnHoverAtom);
  const setColumnSelect = useSetRecoilState(columnSelectAtom);

  return (
    <g
      id={subset.id}
      onClick={
        () => {
          if (currentIntersection?.id === subset.id && selectionType === 'row') { // if the row is already selected, deselect it
            setCurrentIntersection(null);
            setColumnSelect([]);
            setHoveredRow(subset.id);
            setColumnHighlight(getBelongingSetsFromSetMembership(subset.setMembership));
          } else {
            setCurrentIntersection(subset);
            setColumnSelect(getBelongingSetsFromSetMembership(subset.setMembership));
          }
        }
      }
      onMouseEnter={
        () => {
          setHoveredRow(subset.id);
          setColumnHighlight(getBelongingSetsFromSetMembership(subset.setMembership));
        }
      }
      onMouseLeave={() => {
        setHoveredRow(null);
        setColumnHighlight([]);
      }}
      css={mousePointer}
    >
      <rect
        height={dimensions.body.rowHeight}
        width={dimensions.body.rowWidth}
        css={
          currentIntersection?.id === subset.id && selectionType === 'row'
            ? highlight
            : (hoveredRow === subset.id)
              ? hoverHighlight
              : defaultBackground
        }
        rx="5"
        ry="10"
        fillOpacity="0.0"
      />
      <Matrix sets={visibleSets} subset={subset} />
      <BookmarkColumnIcon row={subset} />
      <SizeBar size={subset.size} row={subset} vegaSelected={vegaSelected} querySelected={querySelected} />
      <AttributeBars attributes={subset.attributes} row={subset} />
    </g>
  );
};
