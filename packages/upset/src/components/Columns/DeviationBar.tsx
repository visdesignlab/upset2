import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { Tooltip } from '@mui/material';
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
  deviationScale.range([0, dimensions.attribute.width]);

  return (
    <Tooltip title={`${Math.round(deviation * 1000) / 1000}`}>
      <g
        transform={translate(
          dimensions.attribute.width / 2,
          0,
        )}
      >
        <rect
          fill={(deviation > 0) ? positiveDeviation : negativeDeviation}
          transform={translate(
            deviation > 0 ? 0 : -deviationScale(Math.abs(deviation)) + dimensions.attribute.width / 2,
            0,
          )}
          height={dimensions.attribute.plotHeight}
          width={deviationScale(Math.abs(deviation)) - dimensions.attribute.width / 2}
        />
      </g>
    </Tooltip>
  );
};
