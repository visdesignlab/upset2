/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { maxCardinality } from '../atoms/maxCardinalityAtom';
import { useScale } from '../hooks/useScale';
import translate from '../utils/transform';

type Props = {
  size: number;
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

export const CardinalityBar: FC<Props> = ({ size }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const cardinalityDomain = useRecoilValue(maxCardinality);

  const scale = useScale(
    [0, cardinalityDomain],
    [0, dimensions.header.cardinality.width],
  );

  let fullBars = size > 0 ? Math.floor(size / cardinalityDomain) : size;
  const rem = size % cardinalityDomain;

  const colors = [color1, color2, color3];

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
      transform={translate(
        dimensions.header.matrixColumn.width + dimensions.header.margin,
        (dimensions.body.rowHeight - dimensions.header.cardinality.plotHeight) /
          2,
      )}
    >
      {rectArray.map((arr) => (
        <rect
          transform={translate(0, (arr * offset) / 2)}
          key={arr}
          height={dimensions.header.cardinality.plotHeight - arr * offset}
          width={dimensions.header.cardinality.width}
          css={colors[arr]}
        />
      ))}
      {fullBars < 3 && (
        <rect
          transform={translate(0, (fullBars * offset) / 2)}
          height={dimensions.header.cardinality.plotHeight - fullBars * offset}
          width={scale(rem)}
          css={colors[fullBars]}
        />
      )}
      {fullBars === 3 && (
        <>
          <line
            stroke="white"
            strokeWidth="2px"
            x1={dimensions.header.cardinality.width * 0.8}
            x2={dimensions.header.cardinality.width * 0.85}
            y1={0}
            y2={dimensions.body.rowHeight}
          />
          <line
            stroke="white"
            strokeWidth="2px"
            x1={dimensions.header.cardinality.width * 0.78}
            x2={dimensions.header.cardinality.width * 0.83}
            y1={0}
            y2={dimensions.body.rowHeight}
          />
        </>
      )}
      <text
        textAnchor="start"
        dominantBaseline="middle"
        transform={translate(
          (fullBars > 0 ? dimensions.header.cardinality.width : scale(rem)) + 5,
          dimensions.body.rowHeight / 2,
        )}
      >
        {size}
      </text>
    </g>
  );
};
