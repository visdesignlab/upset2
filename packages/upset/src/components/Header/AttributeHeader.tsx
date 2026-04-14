import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { AttributeButton } from './AttributeButton';
import { AttributeScale } from './AttributeScale';
import { attTypesSelector, attributeMinMaxSelector } from '../../atoms/attributeAtom';
import { createDateTickFormatter } from '../../utils/date';

type Props = {
  attribute: string;
};

export const AttributeHeader: FC<Props> = ({ attribute }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const attTypes = useRecoilValue(attTypesSelector);
  const { min, max } = useRecoilValue(attributeMinMaxSelector(attribute));
  const domain: [number, number] = [min, max];

  return (
    <>
      <AttributeButton label={attribute} />
      <g
        transform={translate(
          0,
          dimensions.attribute.buttonHeight + dimensions.attribute.gap,
        )}
      >
        <AttributeScale
          domain={domain}
          tickFormatter={
            attTypes[attribute] === 'date' ? createDateTickFormatter(domain) : undefined
          }
        />
      </g>
    </>
  );
};
