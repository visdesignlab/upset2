import React from 'react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { maxDeviationSelector } from '../atoms/maxAtoms';
import translate from '../utils/transform';
import { AttributeButton } from './AttributeButton';
import { AttributeScale } from './AttributeScale';

export const DeviationHeader = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const maxDeviation = useRecoilValue(maxDeviationSelector);

  return (
    <g
      transform={translate(
        dimensions.header.matrixColumn.width +
          dimensions.header.margin +
          dimensions.header.cardinality.width +
          dimensions.header.cardinality.textMargin,
        dimensions.header.height() - dimensions.header.attribute.height(),
      )}
    >
      <AttributeButton label="Deviation" />
      <g
        transform={translate(
          0,
          dimensions.header.attribute.buttonHeight +
            dimensions.header.attribute.gap,
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
