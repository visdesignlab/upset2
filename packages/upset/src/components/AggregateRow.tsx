import { css } from '@emotion/react';
import { Aggregate } from '@visdesignlab/upset2-core';
import { FC, useContext } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { bookmarkedIntersectionSelector, currentIntersectionAtom } from '../atoms/config/currentIntersectionAtom';
import translate from '../utils/transform';
import { highlight, mousePointer } from '../utils/styles';
import { SizeBar } from './SizeBar';
import { DeviationBar } from './DeviationBar';
import { Matrix } from './Matrix';
import { BookmarkStar } from './BookmarkStar';
import { collapsedSelector } from '../atoms/collapsedAtom';
import { ProvenanceContext } from './Root';
import { AttributeBars } from './AttributeBars';

/** @jsxImportSource @emotion/react */
type Props = {
  aggregateRow: Aggregate;
};

const expanded = (
  <text dominantBaseline="middle" className="icon" textAnchor="middle">
    &#xf107;
  </text>
);

export const collapsed = (
  <text
    transform="rotate(-90)"
    dominantBaseline="middle"
    className="icon"
    textAnchor="middle"
  >
    &#xf107;
  </text>
);

const secondLevelXOffset = 15;

export const AggregateRow: FC<Props> = ({ aggregateRow }) => {
  const visibleSets = useRecoilValue(visibleSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const currentIntersection = useRecoilValue(currentIntersectionAtom);
  const setCurrentIntersectionAtom = useSetRecoilState(currentIntersectionAtom);
  const bookmarkedIntersections = useRecoilValue(bookmarkedIntersectionSelector);
  const collapsedIds = useRecoilValue(collapsedSelector);
  const { actions } = useContext(ProvenanceContext);

  let width = dimensions.body.rowWidth;
  if (aggregateRow.level === 2) {
    width -= dimensions.body.aggregateOffset;
  }

  const desc =
    aggregateRow.elementName.length < 14 ||
    aggregateRow.aggregateBy !== 'Overlaps'
      ? aggregateRow.elementName
      : `${aggregateRow.elementName.slice(0, 14)}...`;

  return (
    <g
      onClick={() => aggregateRow && (setCurrentIntersectionAtom(aggregateRow))}
      css={mousePointer}
    >
      <g transform={translate(aggregateRow.level === 2 ? secondLevelXOffset : 2, 0)}>
        <rect
          transform={translate(0, 2)}
          css={currentIntersection !== null && currentIntersection.id === aggregateRow.id ?
            highlight :
            css`
            fill: #cccccc;
            opacity: 0.3;
            stroke: #555555;
            stroke-width: 1px;
          `}
          height={(['Sets', 'Overlaps'].includes(aggregateRow.aggregateBy)) ? (dimensions.body.rowHeight - 4) * 2 : dimensions.body.rowHeight - 4}
          width={width}
          rx={5}
          ry={10}
        />
        <g
          transform={translate(10, dimensions.body.rowHeight / 2)}
          onClick={() => {
            if (collapsedIds.includes(aggregateRow.id)) {
              actions.removeCollapsed(aggregateRow.id);
            } else {
              actions.addCollapsed(aggregateRow.id);
            }
          }}
        >
          { collapsedIds.includes(aggregateRow.id) ? collapsed : expanded}
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
      <g transform={translate(0, (['Sets', 'Overlaps'].includes(aggregateRow.aggregateBy)) ? dimensions.body.rowHeight - 5 : 0)}>
        { bookmarkedIntersections.find((b) => b.id === aggregateRow.id) &&
        <BookmarkStar row={aggregateRow} />}
        <SizeBar row={aggregateRow} size={aggregateRow.size} />
        <DeviationBar deviation={aggregateRow.deviation} />
        <AttributeBars attributes={aggregateRow.attributes} />
      </g>
    </g>
  );
};
