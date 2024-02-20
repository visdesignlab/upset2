import { Aggregate, Attributes, Subset } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { visibleAttributesSelector } from '../atoms/config/visibleAttributes';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import translate from '../utils/transform';
import { AttributeBar } from './AttributeBar';

type Props = {
  attributes: Attributes;
  row: Subset | Aggregate;
};

export const AttributeBars: FC<Props> = ({ attributes, row }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleAttribute = useRecoilValue(visibleAttributesSelector);

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
          dimensions.attribute.width +
          dimensions.attribute.vGap,
        (dimensions.body.rowHeight - dimensions.attribute.plotHeight) / 2,
      )}
    >
      {visibleAttribute.map((attr, idx) => (
        <g
          key={attr}
          transform={translate(
            idx * (dimensions.attribute.width + dimensions.attribute.vGap),
            0,
          )}
        >
          <AttributeBar summary={attributes[attr]} attribute={attr} row={row} />
        </g>
      ))}
    </g>
  );
};
