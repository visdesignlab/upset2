/** @jsxImportSource @emotion/react */
import { flattenedRows } from '@visdesignlab/upset2-core';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { columnHoverAtom, rowHoverAtom } from '../atoms/hoverAtom';
import translate from '../utils/transform';
import { dataAtom } from '../atoms/dataAtom';
import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';

export const ForegroundRects = () => {
  const visibleSets = useRecoilValue(visibleSetSelector);
  const data = useRecoilValue(dataAtom);
  const dimensions = useRecoilValue(dimensionsSelector);
  const state = useRecoilValue(upsetConfigAtom);
  const rows = flattenedRows(data, state);
  const setHoveredRow = useSetRecoilState(rowHoverAtom);
  const setHoveredColumn = useSetRecoilState(columnHoverAtom);

  return (
    <>
      <g
        className="foreground-columns"
        transform={translate(dimensions.set.label.height, 0)}
      >
        {visibleSets.map((setName, idx) => (
          <g key={setName} transform={translate(idx * dimensions.set.width, 0)}>
            <rect
              height={dimensions.body.height}
              pointerEvents="all"
              width={dimensions.set.width}
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
        transform={translate(dimensions.set.label.height, 0)}
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
