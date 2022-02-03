/** @jsxImportSource @emotion/react */
import { useRecoilValue } from 'recoil';
import { css } from '@emotion/react';

import { useScale } from '../hooks/useScale';
import translate from '../utils/transform';
import { setsAtom, visibleSetsAtom } from '../atoms/setsAtoms';
import { dimensionsSelector } from '../atoms/dimensionsAtom';

const matrixColumnBackgroundRect = css`
  fill: #f0f0f0;
`;
const matrixColumnForegroundRect = css`
  fill: #636363;
  stroke: #fff;
  stroke-width: 1px;
`;

export const MatrixHeader = () => {
  const sets = useRecoilValue(setsAtom);
  const visibleSets = useRecoilValue(visibleSetsAtom);
  const dimensions = useRecoilValue(dimensionsSelector);

  const { barWidth, height, labelHeight, angle } =
    dimensions.header.matrixColumn;

  const cardinalities = visibleSets.map((s) => sets[s].size);
  const maxCarinality = Math.max(...cardinalities);

  const scale = useScale([0, maxCarinality], [0, height]);

  return (
    <g>
      {visibleSets.map((setName, idx) => (
        <g key={setName} transform={translate(idx * barWidth, 0)}>
          <rect
            css={css`
              ${matrixColumnBackgroundRect}
            `}
            className={setName}
            height={height}
            width={barWidth}
            stroke="none"
            fill="gray"
          />
          <rect
            css={css`
              ${matrixColumnForegroundRect}
            `}
            height={scale(sets[setName].size)}
            width={barWidth}
            stroke="none"
            fill="gray"
            transform={translate(0, height - scale(sets[setName].size))}
          />
          <g transform={translate(0, height)}>
            <rect
              className={setName}
              css={css`
                ${matrixColumnBackgroundRect}
              `}
              height={labelHeight}
              width={barWidth}
              transform={`skewX(${angle})`}
            />
            <text
              css={css`
                font-size: 12px;
              `}
              transform={`${translate(
                labelHeight + barWidth / 2,
                labelHeight,
              )}rotate(${angle})`}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {sets[setName].elementName}
            </text>
          </g>
        </g>
      ))}
    </g>
  );
};
