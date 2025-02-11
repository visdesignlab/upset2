import { css } from '@emotion/react';
import { Aggregate } from '@visdesignlab/upset2-core';
import { FC, useContext } from 'react';
import { useRecoilValue } from 'recoil';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SvgIcon from '@mui/material/SvgIcon';

import { visibleSetSelector } from '../../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { currentIntersectionSelector  } from '../../atoms/config/currentIntersectionAtom';
import translate from '../../utils/transform';
import { highlight, mousePointer } from '../../utils/styles';
import { SizeBar } from '../Columns/SizeBar';
import { Matrix } from '../Columns/Matrix/Matrix';
import { BookmarkStar } from '../Columns/BookmarkStar';
import { collapsedSelector } from '../../atoms/collapsedAtom';
import { ProvenanceContext } from '../Root';
import { AttributeBars } from '../Columns/Attribute/AttributeBars';
import { aggregateSelectedCount } from '../../atoms/elementsSelectors';

/** @jsxImportSource @emotion/react */
/**
 * Props for the AggregateRow component.
 */
type Props = {
  aggregateRow: Aggregate;
};

const iconSize = '20px';

/**
 * Expanded icon for the AggregateRow component.
 */
const expanded = (
  <g className="icon" textAnchor="middle" dominantBaseline="middle">
    <SvgIcon height={iconSize} width={iconSize}>
      <KeyboardArrowDownIcon />
    </SvgIcon>
  </g>
);

/**
 * Collapsed icon for the AggregateRow component.
 */
export const collapsed = (
  <g
    transform={`rotate(180) translate(-${iconSize.replace(
      'px',
      '',
    )}, -${iconSize.replace('px', '')})`}
    className="icon"
    textAnchor="middle"
    dominantBaseline="middle"
  >
    <SvgIcon height={iconSize} width={iconSize}>
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
  const collapsedIds = useRecoilValue(collapsedSelector);
  const { actions } = useContext(ProvenanceContext);
  const selected = useRecoilValue(aggregateSelectedCount(aggregateRow));

  let width = dimensions.body.rowWidth;
  if (aggregateRow.level === 2) {
    width -= dimensions.body.aggregateOffset;
  }

  /**
   * Truncates the element name if it is longer than 14 characters and the aggregateBy value is 'Overlaps'.
   * Otherwise, description is the element name.
   */
  const desc =
    aggregateRow.elementName.length < 14 ||
    aggregateRow.aggregateBy !== 'Overlaps'
      ? aggregateRow.elementName
      : `${aggregateRow.elementName.slice(0, 14)}...`;

  return (
    <g
      id={aggregateRow.id}
      onClick={() =>
        aggregateRow &&
        (currentIntersection?.id === aggregateRow.id
          ? actions.setSelected(null)
          : actions.setSelected(aggregateRow))
      }
      css={mousePointer}
    >
      <g
        transform={translate(
          aggregateRow.level === 2 ? secondLevelXOffset : 2,
          0,
        )}
      >
        <rect
          transform={translate(0, 2)}
          css={currentIntersection?.id === aggregateRow.id && highlight}
          height={
            ['Sets', 'Overlaps'].includes(aggregateRow.aggregateBy)
              ? (dimensions.body.rowHeight - 4) * 2
              : dimensions.body.rowHeight - 4
          }
          width={width}
          rx={5}
          ry={10}
          fill="#cccccc"
          opacity="0.3"
          stroke="#555555"
          strokeWidth="1px"
        />
        <g>
          {collapsedIds.includes(aggregateRow.id) ? collapsed : expanded}
          {/* onclick background element */}
          <rect
            width={iconSize}
            height={iconSize}
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
      {['Sets', 'Overlaps'].includes(aggregateRow.aggregateBy) && (
        <g transform={translate(0, dimensions.body.rowHeight - 5)}>
          <Matrix
            sets={visibleSets}
            subset={aggregateRow}
            showConnectingBar={aggregateRow.aggregateBy !== 'Overlaps'}
          />
        </g>
      )}
      <g
        transform={translate(
          0,
          ['Sets', 'Overlaps'].includes(aggregateRow.aggregateBy)
            ? dimensions.body.rowHeight - 5
            : 0,
        )}
      >
        <BookmarkStar row={aggregateRow} />
        <SizeBar
          row={aggregateRow}
          size={aggregateRow.size}
          selected={selected}
        />
        <AttributeBars
          attributes={aggregateRow.attributes}
          row={aggregateRow}
        />
      </g>
    </g>
  );
};
