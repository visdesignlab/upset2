import { css } from '@emotion/react';
import { Aggregate } from '@visdesignlab/upset2-core';
import { FC, useContext } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SvgIcon from '@mui/material/SvgIcon';

import { visibleSetSelector } from '../../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import {
  currentSelectionType,
  currentIntersectionSelector,
} from '../../atoms/config/selectionAtoms';
import translate from '../../utils/transform';
import {
  highlight,
  mousePointer,
  DEFAULT_ROW_BACKGROUND_COLOR,
  ROW_BORDER_STROKE_COLOR,
  ROW_BORDER_STROKE_WIDTH,
  DEFAULT_ROW_BACKGROUND_OPACITY,
} from '../../utils/styles';
import { SizeBar } from '../Columns/SizeBar';
import { Matrix } from '../Columns/Matrix/Matrix';
import { BookmarkColumnIcon } from '../Columns/BookmarkColumnIcon';
import { collapsedSelector } from '../../atoms/collapsedAtom';
import { ProvenanceContext } from '../Root';
import { AttributeBars } from '../Columns/Attribute/AttributeBars';
import { aggregateSelectedCount } from '../../atoms/elementsSelectors';
import { UpsetActions } from '../../provenance';
import { rowHoverAtom } from '../../atoms/highlightAtom';
import { TALL_ROW_TYPES } from '../../dimensions';

/**
 * Props for the AggregateRow component.
 */
type Props = {
  aggregateRow: Aggregate;
};

const ICON_SIZE = 20;
const ICON_SIZE_TEXT = `${ICON_SIZE}px`;
const ICON_ADJUSTMENT = 1.5;

/**
 * Expanded icon for the AggregateRow component.
 */
const expanded = (
  <g
    className="icon"
    textAnchor="middle"
    dominantBaseline="middle"
    transform={translate(ICON_ADJUSTMENT, ICON_ADJUSTMENT)}
  >
    <SvgIcon height={ICON_SIZE_TEXT} width={ICON_SIZE_TEXT}>
      <KeyboardArrowDownIcon />
    </SvgIcon>
  </g>
);

/**
 * Collapsed icon for the AggregateRow component.
 */
export const collapsed = (
  <g
    transform={`rotate(180) ${translate(-ICON_SIZE - ICON_ADJUSTMENT, -ICON_SIZE - ICON_ADJUSTMENT)}`}
    className="icon"
    textAnchor="middle"
    dominantBaseline="middle"
  >
    <SvgIcon height={ICON_SIZE_TEXT} width={ICON_SIZE_TEXT}>
      <KeyboardArrowDownIcon />
    </SvgIcon>
  </g>
);

const secondLevelXOffset = 15;

/**
 * Represents a component that renders an aggregate row.
 *
 * @component
 * @param {Aggregate} aggregateRow - The AggregateRow to render.
 * @returns {JSX.Element} The rendered AggregateRow component.
 */
export const AggregateRow: FC<Props> = ({ aggregateRow }) => {
  const visibleSets = useRecoilValue(visibleSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);
  const selectionType = useRecoilValue(currentSelectionType);
  const collapsedIds = useRecoilValue(collapsedSelector);
  const { actions }: { actions: UpsetActions } = useContext(ProvenanceContext);
  const vegaSelected = useRecoilValue(
    aggregateSelectedCount({ agg: aggregateRow, type: 'vega' }),
  );
  const querySelected = useRecoilValue(
    aggregateSelectedCount({ agg: aggregateRow, type: 'query' }),
  );
  const setHoveredRow = useSetRecoilState(rowHoverAtom);

  let width = dimensions.body.rowWidth;
  if (aggregateRow.level === 2) {
    width -= dimensions.body.aggregateOffset;
  }

  /**
   * Truncates the element name if it is longer than 14 characters and the aggregateBy value is 'Overlaps'.
   * Otherwise, description is the element name.
   */
  const desc =
    aggregateRow.elementName.length < 14 || aggregateRow.aggregateBy !== 'Overlaps'
      ? aggregateRow.elementName
      : `${aggregateRow.elementName.slice(0, 14)}...`;

  return (
    <g
      id={aggregateRow.id}
      onClick={() => {
        if (
          aggregateRow &&
          currentIntersection?.id === aggregateRow.id &&
          selectionType === 'row'
        ) {
          actions.setRowSelection(null);
        } else {
          actions.setRowSelection(aggregateRow);
        }
      }}
      css={mousePointer}
      onMouseEnter={() => setHoveredRow(aggregateRow.id)}
      onMouseLeave={() => setHoveredRow(null)}
    >
      <g transform={translate(aggregateRow.level === 2 ? secondLevelXOffset : 2, 0)}>
        <rect
          transform={translate(0, 2)}
          css={
            currentIntersection?.id === aggregateRow.id &&
            selectionType === 'row' &&
            highlight
          }
          height={
            TALL_ROW_TYPES.includes(aggregateRow.aggregateBy)
              ? dimensions.body.aggRowHeight - 4
              : dimensions.body.rowHeight - 4
          }
          width={width}
          rx={5}
          ry={10}
          fill={DEFAULT_ROW_BACKGROUND_COLOR}
          opacity={DEFAULT_ROW_BACKGROUND_OPACITY}
          stroke={ROW_BORDER_STROKE_COLOR}
          strokeWidth={ROW_BORDER_STROKE_WIDTH}
        />
        <g>
          {collapsedIds.includes(aggregateRow.id) ? collapsed : expanded}
          {/* onclick background element */}
          <rect
            width={ICON_SIZE_TEXT}
            height={ICON_SIZE_TEXT}
            fill="transparent"
            onClick={(e) => {
              e.stopPropagation();
              if (collapsedIds.includes(aggregateRow.id)) {
                actions.removeCollapsed(aggregateRow.id);
              } else {
                actions.addCollapsed(aggregateRow.id);
              }
            }}
          />
        </g>
        <text
          css={css`
            font-size: 14px;
            font-weight: 450;
          `}
          transform={translate(20, dimensions.body.rowHeight / 2)}
          dominantBaseline="middle"
        >
          <title>{aggregateRow.elementName}</title>
          {desc}
        </text>
      </g>
      {TALL_ROW_TYPES.includes(aggregateRow.aggregateBy) && (
        <g transform={translate(0, dimensions.body.rowHeight - 5)}>
          <Matrix
            sets={visibleSets}
            subset={aggregateRow}
            showConnectingBar={aggregateRow.aggregateBy !== 'Overlaps'}
          />
        </g>
      )}
      <g>
        <BookmarkColumnIcon row={aggregateRow} />
        <SizeBar
          row={aggregateRow}
          size={aggregateRow.size}
          vegaSelected={vegaSelected}
          querySelected={querySelected}
        />
        <AttributeBars attributes={aggregateRow.attributes} row={aggregateRow} />
      </g>
    </g>
  );
};
