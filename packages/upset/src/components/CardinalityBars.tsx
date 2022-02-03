/** @jsxImportSource @emotion/react */
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { maxCardinality } from '../atoms/maxCardinalityAtom';
import { useScale } from '../hooks/useScale';
import translate from '../utils/transform';

type Props = {
  size: number;
};

export const CardinalityBar: FC<Props> = ({ size }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const cardinalityDomain = useRecoilValue(maxCardinality);

  const scale = useScale(
    [0, cardinalityDomain],
    [0, dimensions.header.cardinality.width],
  );

  let fullBars = size > 0 ? Math.floor(size / cardinalityDomain) : size;
  const rem = size % cardinalityDomain;

  const colors = ['#bdbdbd', '#888888', '#252525'];

  if (size < 0 || cardinalityDomain < 0) return null;

  if (fullBars >= 3) {
    fullBars = 3;
  }

  const rectArray: number[] = [];
  for (let i = 0; i < fullBars; ++i) {
    rectArray[i] = i;
  }

  return (
    <g
      transform={translate(
        dimensions.header.margin + dimensions.header.matrixColumn.width,
        1,
      )}
    >
      {rectArray.map((r, idx) => (
        <g key={r} transform={translate(0, idx * 5)}>
          <rect
            height={dimensions.body.rowHeight - 2 * idx * 5}
            width={dimensions.header.cardinality.width}
            fill={colors[r]}
          />
        </g>
      ))}
      {fullBars < 3 ? (
        <g transform={translate(0, fullBars * 5)}>
          <rect
            height={dimensions.body.rowHeight - 2 * fullBars * 5}
            width={scale(rem)}
            fill={colors[fullBars]}
          />
        </g>
      ) : (
        <g>
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
        </g>
      )}
      <text
        textAnchor="start"
        dominantBaseline="middle"
        transform={translate(
          fullBars > 0 ? dimensions.header.cardinality.width : scale(rem),
          dimensions.body.rowHeight / 2,
        )}
      >
        {size}
      </text>
    </g>
  );
};
