import { Aggregate, Subset } from '@visdesignlab/upset2-core';
import {
  FC, memo, useMemo, useState,
} from 'react';
import { useRecoilValue } from 'recoil';
import { Tooltip } from '@mui/material';
import { dimensionsSelector } from '../../../atoms/dimensionsAtom';
import translate from '../../../utils/transform';
import { categoricalColorSelector, categoricalCountSelector } from '../../../atoms/attributeAtom';
import { useScale } from '../../../hooks/useScale';
import { maxRowSizeSelector } from '../../../atoms/maxSizeAtom';

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

/** A stacked bar */
type Bar = {
  /** Bar width in px */
  width: number;
  /** Bar offset from left in px */
  offset: number;
  /** The named category */
  category: string;
  /** The size of the named category in this bar */
  size: number;
}

/**
 * A stacked bar showing the values of a categorical attribute for one intersection
 * @param attribute - The attribute to render
 * @param row - The row to render the attribute bar for
 */
export const CategoricalAttBar: FC<Props> = memo(
  ({ attribute, row }: Props) => {
    const dimensions = useRecoilValue(dimensionsSelector);
    const attCounts = useRecoilValue(categoricalCountSelector({ row: row.id, attribute }));
    const maxSize = useRecoilValue(maxRowSizeSelector);
    const colors = useRecoilValue(categoricalColorSelector(Object.keys(attCounts).length));
    const scale = useScale([0, maxSize], [0, dimensions.attribute.width]);
    const [hovered, setHovered] = useState<string | null>(null);

    const bars: Bar[] = useMemo(() => {
      let offset = 0;
      return Object.entries(attCounts).map(
        ([category, size]) => {
          const result = {
            width: scale(size), offset, category, size,
          };
          offset += result.width;
          return result;
        },
      );
    }, [attCounts, scale]);

    return (
      <g>
        {bars.map((bar, index) => (
          <g
            key={`${row.id}-${attribute}-${bar.category}`}
            transform={translate(bar.offset, 0)}
          >
            <Tooltip title={`${bar.category} — ${bar.size}`}>
              <rect
                fill={colors[index]}
                width={bar.width}
                height={dimensions.attribute.plotHeight + (hovered === bar.category ? 4 : 0)}
                y={hovered === bar.category ? -2 : 0}
                onMouseEnter={() => setHovered(bar.category)}
                onMouseLeave={() => setHovered(null)}
              />
            </Tooltip>
          </g>
        ))}
      </g>
    );
  },
);
