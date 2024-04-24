import React from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { maxDeviationSelector } from '../../atoms/maxAtoms';
import translate from '../../utils/transform';
import { AttributeButton } from './AttributeButton';
import { AttributeScale } from './AttributeScale';

export const DeviationHeader = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const maxDeviation = useRecoilValue(maxDeviationSelector);

  return (
    <g>
      <AttributeButton label="Deviation" />
      <g
        transform={translate(
          0,
          dimensions.attribute.buttonHeight + dimensions.attribute.gap,
        )}
      >
        <AttributeScale
          domain={[-maxDeviation, maxDeviation]}
          tickFormatter={(val: number) => `${val}%`}
        />
      </g>
    </g>
  );
};
