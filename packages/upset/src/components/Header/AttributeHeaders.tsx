import { useRecoilValue } from 'recoil';

import { visibleAttributesSelector } from '../../atoms/config/visibleAttributes';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { AttributeHeader } from './AttributeHeader';

export const AttributeHeaders = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleAttribute = useRecoilValue(visibleAttributesSelector);

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
          dimensions.gap +
          dimensions.cardinality.width +
          dimensions.bookmarkStar.gap +
          dimensions.bookmarkStar.width +
          dimensions.bookmarkStar.gap +
          dimensions.attribute.width +
          dimensions.attribute.vGap,
        dimensions.header.totalHeight - dimensions.attribute.height,
      )}
    >
      {visibleAttribute.map((attribute, idx) => {
        return (
          <g
            key={attribute}
            transform={translate(
              idx * (dimensions.attribute.width + dimensions.attribute.vGap),
              0,
            )}
          >
            <AttributeHeader attribute={attribute} />
          </g>
        );
      })}
    </g>
  );
};
