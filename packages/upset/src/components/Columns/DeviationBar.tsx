import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { deviationScaleAtom } from '../../atoms/scaleAtoms';
import translate from '../../utils/transform';

/** @jsxImportSource @emotion/react */
type Props = {
  deviation: number;
};

const negativeDeviation = '#f46d43';

const positiveDeviation = '#74add1';

export const DeviationBar: FC<Props> = ({ deviation }) => {
  const dimensions = useRecoilValue(dimensionsSelector);

  const deviationScale = useRecoilValue(deviationScaleAtom);
  deviationScale.range([0, dimensions.attribute.width / 2]);

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
        dimensions.bookmarkStar.gap +
        dimensions.bookmarkStar.width +
        dimensions.bookmarkStar.gap +
        dimensions.degreeColumn.width +
        dimensions.degreeColumn.gap +
        dimensions.size.width +
        dimensions.gap +
        dimensions.attribute.width / 2,
        (dimensions.body.rowHeight - dimensions.attribute.plotHeight) / 2,
      )}
    >
      <rect
        fill={(deviation > 0) ? positiveDeviation : negativeDeviation}
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
