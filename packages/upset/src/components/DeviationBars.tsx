/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { deviationScaleAtom } from '../atoms/scaleAtoms';
import translate from '../utils/transform';

type Props = {
  deviation: number;
};

const negativeDeviation = css`
  fill: #f46d43;
`;
const positiveDeviation = css`
  fill: #74add1;
`;

export const DeviationBar: FC<Props> = ({ deviation }) => {
  const dimensions = useRecoilValue(dimensionsSelector);

  const deviationScale = useRecoilValue(deviationScaleAtom);
  deviationScale.range([0, dimensions.attribute.width / 2]);

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
          dimensions.gap +
          dimensions.cardinality.width +
          dimensions.gap +
          dimensions.attribute.width / 2,
        (dimensions.body.rowHeight - dimensions.attribute.plotHeight) / 2,
      )}
    >
      <rect
        css={css`
          ${deviation > 0 ? positiveDeviation : negativeDeviation}
        `}
        transform={translate(
          deviation > 0 ? 0 : -deviationScale(Math.abs(deviation)),
          0,
        )}
        height={dimensions.attribute.plotHeight}
        width={deviationScale(Math.abs(deviation))}
      />
    </g>
  );
};
