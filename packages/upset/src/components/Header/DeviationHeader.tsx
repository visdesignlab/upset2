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
    <g
      transform={translate(
        dimensions.matrixColumn.width +
        dimensions.bookmarkStar.gap +
        dimensions.bookmarkStar.width +
        dimensions.bookmarkStar.gap +
        dimensions.degreeColumn.width +
        dimensions.degreeColumn.gap +
        dimensions.size.width +
        dimensions.gap,
        dimensions.header.totalHeight - dimensions.attribute.height,
      )}
    >
      <AttributeButton label="Deviation" sortable />
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
