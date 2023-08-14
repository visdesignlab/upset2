import { css } from '@emotion/react';
import { Row } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { currentIntersectionAtom } from '../atoms/config/currentIntersectionAtom';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { maxSize } from '../atoms/maxSizeAtom';
import { useScale } from '../hooks/useScale';
import translate from '../utils/transform';

/** @jsxImportSource @emotion/react */
type Props = {
  size: number;
  row?: Row;
};

const color1 = css`
  fill: rgb(189, 189, 189);
`;

const color2 = css`
  fill: rgb(136, 136, 136);
`;

const color3 = css`
  fill: rgb(37, 37, 37);
`;

const color4 = css`
  fill: rgb(116, 173, 209);
`;

const color5 = css`
  fill: rgb(94, 102, 171);
`;

const color6 = css`
  fill: rgb(29, 41, 71);
`;

export const SizeBar: FC<Props> = ({ row, size }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const sizeDomain = useRecoilValue(maxSize);
  const currentIntersection = useRecoilValue(currentIntersectionAtom);

  const scale = useScale(
    [0, sizeDomain],
    [0, dimensions.attribute.width],
  );

  let fullBars = size > 0 ? Math.floor(size / sizeDomain) : size;
  const rem = size % sizeDomain;

  const colors = [color1, color2, color3, color4, color5, color6];

  const highlightOffset = 3;

  if (size < 0 || sizeDomain < 0) return null;

  if (fullBars >= 3) {
    fullBars = 3;
  }

  const offset = 6;

  const rectArray: number[] = [];
  for (let i = 0; i < fullBars; ++i) {
    rectArray[i] = i;
  }

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
        dimensions.bookmarkStar.gap +
        dimensions.bookmarkStar.width +
        dimensions.bookmarkStar.gap,
        (dimensions.body.rowHeight - dimensions.size.plotHeight) / 2,
      )}
    >
      {rectArray.map((arr) => (
        <rect
          transform={translate(0, (arr * offset) / 2)}
          key={arr}
          height={dimensions.size.plotHeight - arr * offset}
          width={dimensions.attribute.width}
          css={row !== undefined && currentIntersection !== null && currentIntersection.id === row.id ? colors[arr + highlightOffset] : colors[arr]}
        />
      ))}
      {fullBars < 3 && (
        <rect
          transform={translate(0, (fullBars * offset) / 2)}
          height={dimensions.size.plotHeight - fullBars * offset}
          width={scale(rem)}
          css={row !== undefined && currentIntersection !== null && currentIntersection.id === row.id ? colors[fullBars + highlightOffset] : colors[fullBars]}
        />
      )}
      {fullBars === 3 && (
        <>
          <line
            stroke="white"
            strokeWidth="2px"
            x1={dimensions.attribute.width * 0.8}
            x2={dimensions.attribute.width * 0.85}
            y1={0}
            y2={dimensions.body.rowHeight}
          />
          <line
            stroke="white"
            strokeWidth="2px"
            x1={dimensions.attribute.width * 0.78}
            x2={dimensions.attribute.width * 0.83}
            y1={0}
            y2={dimensions.body.rowHeight}
          />
        </>
      )}
      <text
        textAnchor="start"
        dominantBaseline="middle"
        transform={translate(
          (fullBars > 0 ? dimensions.attribute.width : scale(rem)) + 5,
          dimensions.body.rowHeight / 2,
        )}
      >
        {size}
      </text>
    </g>
  );
};
