/** @jsxImportSource @emotion/react */
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { columnHoverAtom, rowHoverAtom } from '../atoms/hoverAtom';
import { flattenedRowsSelector } from '../atoms/renderRowsAtom';
import { visibleSetsAtom } from '../atoms/setsAtoms';
import translate from '../utils/transform';

export const ForegroundRects = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleSets = useRecoilValue(visibleSetsAtom);
  const rows = useRecoilValue(flattenedRowsSelector);
  const setHoveredRow = useSetRecoilState(rowHoverAtom);
  const setHoveredColumn = useSetRecoilState(columnHoverAtom);

  return (
    <>
      <g
        className="foreground-columns"
        transform={translate(dimensions.header.matrixColumn.labelHeight, 0)}
      >
        {visibleSets.map((setName, idx) => (
          <g
            key={setName}
            transform={translate(idx * dimensions.body.rowHeight, 0)}
          >
            <rect
              height={dimensions.body.height()}
              pointerEvents="all"
              width={dimensions.header.matrixColumn.barWidth}
              fill="none"
              onMouseEnter={() => {
                setHoveredColumn(setName);
              }}
              onMouseLeave={() => {
                setHoveredColumn(null);
              }}
            />
          </g>
        ))}
      </g>
      <g
        className="foreground-rows"
        transform={translate(dimensions.header.matrixColumn.labelHeight, 0)}
      >
        {rows.map((row, idx) => (
          <g
            key={row.id}
            transform={translate(0, idx * dimensions.body.rowHeight)}
          >
            {row.row.type === 'Subset' && (
              <rect
                height={dimensions.body.rowHeight}
                pointerEvents="all"
                width={dimensions.body.rowWidth}
                fill="none"
                onMouseEnter={() => {
                  setHoveredRow(row.id);
                }}
                onMouseLeave={() => {
                  setHoveredRow(null);
                }}
              />
            )}
          </g>
        ))}
      </g>
    </>
  );
};
