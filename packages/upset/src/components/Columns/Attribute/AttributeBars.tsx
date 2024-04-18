import { Aggregate, Attributes, Subset, getDegreeFromSetMembership } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { visibleAttributesSelector } from '../../../atoms/config/visibleAttributes';
import { dimensionsSelector } from '../../../atoms/dimensionsAtom';
import translate from '../../../utils/transform';
import { AttributeBar } from './AttributeBar';
import { DeviationBar } from '../DeviationBar';
import { Degree } from '../Degree';

type Props = {
  attributes: Attributes;
  row: Subset | Aggregate;
};

export const AttributeBars: FC<Props> = ({ attributes, row }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleAttributes = useRecoilValue(visibleAttributesSelector);

  const degreeXOffset = dimensions.degreeColumn.width + dimensions.degreeColumn.gap;
  const attributeXOffset = dimensions.attribute.width + dimensions.attribute.vGap;

  function getColToRender(attribute: string) {
    switch (attribute) {
      case 'Degree':
        return <Degree degree={getDegreeFromSetMembership(row.setMembership)} />
      case 'Deviation':
        return <DeviationBar deviation={row.attributes.deviation} />;
      default:
        return <AttributeBar summary={attributes[attribute]} attribute={attribute} row={row} />;
    }
  }

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
        dimensions.bookmarkStar.gap +
        dimensions.bookmarkStar.width +
        dimensions.bookmarkStar.gap +
        dimensions.size.width +
        dimensions.gap,
        (dimensions.body.rowHeight - dimensions.attribute.plotHeight) / 2,
      )}
    >
      {visibleAttributes.map((attribute, idx) => (
        <g
          key={attribute}
          transform={translate(
            (attribute === 'Degree' ?
              0 :
              visibleAttributes.includes('Degree') ?
                ((idx - 1) * attributeXOffset) + degreeXOffset : // Degree should always be first, and has a smaller offset than a normal attribute
                idx * attributeXOffset),
            0,
          )}
        >
          { getColToRender(attribute) }
        </g>
      ))}
    </g>
  );
};
