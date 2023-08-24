import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { AttributeButton } from './AttributeButton';
import { AttributeScale } from './AttributeScale';
import { attributeMinMaxSelector } from '../../atoms/attributeAtom';

type Props = {
  attribute: string;
};

export const AttributeHeader: FC<Props> = ({ attribute }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const { min, max } = useRecoilValue(attributeMinMaxSelector(attribute));

  return (
    <>
      <AttributeButton label={attribute} />
      <g
        transform={translate(
          0,
          dimensions.attribute.buttonHeight + dimensions.attribute.gap,
        )}
      >
        <AttributeScale domain={[min, max]} />
      </g>
    </>
  );
};
