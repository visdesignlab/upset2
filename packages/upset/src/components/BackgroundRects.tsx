/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { columnHoverAtom, rowHoverAtom } from '../atoms/hoverAtom';
import { visibleSetsAtom } from '../atoms/setsAtoms';
import { subsetSelector } from '../atoms/subsetAtoms';
import { highlightBackground } from '../utils/styles';
import translate from '../utils/transform';

export const BackgroundRects = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleSets = useRecoilValue(visibleSetsAtom);
  const subsets = useRecoilValue(subsetSelector);
  const hoveredRow = useRecoilValue(rowHoverAtom);
  const hoveredColumn = useRecoilValue(columnHoverAtom);

  return (
    <>
      <g
        className="background-columns"
        transform={translate(dimensions.header.matrixColumn.labelHeight, 0)}
      >
        {visibleSets.map((setName, idx) => (
          <g
            key={setName}
            transform={translate(idx * dimensions.body.rowHeight, 0)}
          >
            <rect
              className={setName}
              css={css`
                ${hoveredColumn === setName && highlightBackground}
              `}
              height={dimensions.body.height()}
              width={dimensions.header.matrixColumn.barWidth}
              fill="none"
            />
          </g>
        ))}
      </g>
      <g
        className="background-rows"
        transform={translate(dimensions.header.matrixColumn.labelHeight, 0)}
      >
        {subsets.order.map((subsetId, idx) => (
          <g
            key={subsetId}
            transform={translate(0, idx * dimensions.body.rowHeight)}
          >
            <rect
              key={subsetId}
              className={subsetId}
              css={css`
                ${hoveredRow === subsetId && highlightBackground}
              `}
              height={dimensions.body.rowHeight}
              width={dimensions.body.rowWidth}
              fill="none"
            />
          </g>
        ))}
      </g>
    </>
  );
};
