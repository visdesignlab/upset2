import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { itemsAtom } from '../../atoms/itemsAtoms';
import translate from '../../utils/transform';
import { AttributeButton } from './AttributeButton';
import { AttributeScale } from './AttributeScale';

type Props = {
  attribute: string;
};

export const AttributeHeader: FC<Props> = ({ attribute }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const items = useRecoilValue(itemsAtom);
  const attributes = Object.values(items).map(
    (item) => item[attribute],
  ) as number[];
  const [min, max] = [Math.min(...attributes), Math.max(...attributes)];

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
