import { useRecoilValue } from 'recoil';

import { visibleAttributesSelector } from '../../atoms/config/visibleAttributes';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { AttributeHeader } from './AttributeHeader';
import { DeviationHeader } from './DeviationHeader';
import { DegreeHeader } from './DegreeHeader';

/**
 * Renders the attribute headers component.
 * This component displays the headers for each attribute in the plot.
 */
export const AttributeHeaders = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleAttributes = useRecoilValue(visibleAttributesSelector);

  const degreeXOffset = dimensions.degreeColumn.width + dimensions.degreeColumn.gap;
  const attributeXOffset = dimensions.attribute.width + dimensions.attribute.vGap;

  /**
   * Returns the header component to render based on the given attribute.
   * @param attribute - The attribute to determine the header component for.
   * @returns The header component to render.
   */
  function getHeaderToRender(attribute: string) {
    switch (attribute) {
      case 'Degree':
        return <DegreeHeader />;
      case 'Deviation':
        return <DeviationHeader />;
      default:
        return <AttributeHeader attribute={attribute} />;
    }
  }

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
        dimensions.gap +
        dimensions.size.width +
        dimensions.bookmarkStar.gap +
        dimensions.bookmarkStar.width +
        dimensions.bookmarkStar.gap,
        dimensions.header.totalHeight - dimensions.attribute.height,
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
          { getHeaderToRender(attribute) }
        </g>
      ))}
    </g>
  );
};
