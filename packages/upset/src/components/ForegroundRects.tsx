/** @jsxImportSource @emotion/react */
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { columnHoverAtom, rowHoverAtom } from '../atoms/highlightAtom';
import translate from '../utils/transform';
import { flattenedRowsSelector } from '../atoms/renderRowsAtom';

export const ForegroundRects = () => {
  const visibleSets = useRecoilValue(visibleSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const rows = useRecoilValue(flattenedRowsSelector);
  const setHoveredRow = useSetRecoilState(rowHoverAtom);
  const setHoveredColumn = useSetRecoilState(columnHoverAtom);

  return (
    <>
      <g
        className="foreground-columns"
        transform={translate(dimensions.xOffset, 0)}
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
        transform={translate(dimensions.xOffset, 0)}
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
