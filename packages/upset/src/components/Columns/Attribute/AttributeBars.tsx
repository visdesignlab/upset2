import {
  Aggregate, Attributes, Subset, getDegreeFromSetMembership,
} from '@visdesignlab/upset2-core';
import { FC, memo } from 'react';
import { useRecoilValue } from 'recoil';

import { visibleAttributesSelector } from '../../../atoms/config/visibleAttributes';
import { dimensionsSelector } from '../../../atoms/dimensionsAtom';
import translate from '../../../utils/transform';
import { AttributeBar } from './AttributeBar';
import { DeviationBar } from '../DeviationBar';
import { Degree } from '../Degree';

/**
 * Props for the AttributeBars component.
 * attributes: all visible attributes for the row.
 * row: The row to render the attribute bars for.
 */
type Props = {
  attributes: Attributes;
  row: Subset | Aggregate;
};

/**
 * Renders the attribute bars for a given row.
 *
 * @param attributes - all visible attributes for the row.
 * @param row - The row to render the attribute bars for.
 * @returns The JSX element representing the attribute bars.
 */
export const AttributeBars: FC<Props> = memo(
  ({ attributes, row }: Props) => {
    const dimensions = useRecoilValue(dimensionsSelector);
    const visibleAttributes = useRecoilValue(visibleAttributesSelector);

    const degreeXOffset = dimensions.degreeColumn.width + dimensions.degreeColumn.gap;
    const attributeXOffset = dimensions.attribute.width + dimensions.attribute.vGap;

    /**
   * Returns the column to render based on the given attribute.
   *
   * @param attribute - The attribute to determine the column for.
   * @returns The column component to render.
   */
    function getColToRender(attribute: string) {
      switch (attribute) {
        case 'Degree':
          return <Degree degree={getDegreeFromSetMembership(row.setMembership)} />;
        case 'Deviation':
          return <DeviationBar deviation={row.attributes.deviation} />;
        default:
          return <AttributeBar summary={attributes[attribute]} attribute={attribute} row={row} key={`${row}:${attribute}`} />;
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
  },
  // Only re-render if the row or visible attributes change
  // Since the data shouldn't change, the attribute values should be the same for the same row
  (prevProps, nextProps) => prevProps.row.id === nextProps.row.id
  && Object.keys(prevProps.attributes).every(
    (k) => Object.keys(nextProps.attributes).includes(k),
  ),
);
