import { Aggregate, Subset } from '@visdesignlab/upset2-core';
import { FC, memo } from 'react';

/**
 * Attribute bar props
 */
type Props = {
  /**
   * The attribute to render
   */
  attribute: string;
  /**
   * Row Type
   */
  row: Subset | Aggregate;
}

export const CategoricalAttBar: FC<Props> = memo(
  ({ attribute, row }: Props) => {
    console.log(attribute, row);
    return (
      <g>
        <text>Hi!</text>
      </g>
    );
  },
);
