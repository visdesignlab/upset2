import { css } from '@emotion/react';
import { Row } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import { currentIntersectionAtom } from '../atoms/config/currentIntersectionAtom';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { maxCardinality } from '../atoms/maxCardinalityAtom';
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

const rowStyle = css`
  cursor: pointer;
`;

export const CardinalityBar: FC<Props> = ({ row, size }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const cardinalityDomain = useRecoilValue(maxCardinality);
  const setCurrentIntersectionAtom = useSetRecoilState(currentIntersectionAtom);
  let currentIntersection = useRecoilValue(currentIntersectionAtom);

  const scale = useScale(
    [0, cardinalityDomain],
    [0, dimensions.attribute.width],
  );

  let fullBars = size > 0 ? Math.floor(size / cardinalityDomain) : size;
  const rem = size % cardinalityDomain;

  const colors = [color1, color2, color3, color4];

  if (size < 0 || cardinalityDomain < 0) return null;

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
      onClick={() => row && (setCurrentIntersectionAtom(row))}
      transform={translate(
        dimensions.matrixColumn.width + dimensions.gap,
        (dimensions.body.rowHeight - dimensions.cardinality.plotHeight) / 2,
      )}
      css={rowStyle}
    >
      {rectArray.map(arr => (
        <rect
          transform={translate(0, (arr * offset) / 2)}
          key={arr}
          height={dimensions.cardinality.plotHeight - arr * offset}
          width={dimensions.attribute.width}
          css={currentIntersection === row ? colors[3] : colors[arr]}
        />
      ))}
      {fullBars < 3 && (
        <rect
          transform={translate(0, (fullBars * offset) / 2)}
          height={dimensions.cardinality.plotHeight - fullBars * offset}
          width={scale(rem)}
          css={currentIntersection === row ? colors[3] : colors[fullBars]}
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
