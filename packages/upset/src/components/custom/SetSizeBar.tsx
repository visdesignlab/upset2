import { ScaleLinear } from 'd3-scale';
import { FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import Group from './Group';
import { columnHoverAtom, columnSelectAtom } from '../../atoms/highlightAtom';
import { hoverHighlight } from '../../utils/styles';
import { showSetSizesSelector } from '../../atoms/config/displayAtoms';

type Props = {
  scale: ScaleLinear<number, number>;
  setId: string;
  size: number;
  label: string;
  showLabel?: boolean;
  foregroundOpacity?: number;
  tx?: number;
  ty?: number;
  /** Whether this element should always hide size text regardless of the global setting */
  hideSizeText?: boolean;
};

export const SetSizeBar: FC<Props> = ({
  scale,
  size,
  setId,
  label,
  tx = 0,
  ty = 0,
  foregroundOpacity = 1,
  showLabel = false,
  hideSizeText = false,
}) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const columnHover = useRecoilValue(columnHoverAtom);
  const columnSelect = useRecoilValue(columnSelectAtom);
  const showSize = useRecoilValue(showSetSizesSelector);

  const barSize = useMemo(() => scale(size), [size, scale]);

  return (
    <Group
      tx={tx}
      ty={ty}
    >
      <title>
        {`${label} - ${size}`}
      </title>

      <rect
        css={
          (columnHover.includes(setId) || columnSelect.includes(setId)) &&
            hoverHighlight
        }
        height={dimensions.set.size.height}
        width={dimensions.set.width}
        stroke="none"
        fill="#f0f0f0"
        fillOpacity={1.0}
      />
      {(showSize && !hideSizeText && size > 0) && (
        <foreignObject
          transform={`${translate(0, dimensions.set.label.height - 2)}rotate(-90)`}
          height={dimensions.set.width}
          width={dimensions.set.label.height - (dimensions.set.width / 2)}
          z={1}
          style={{
            color: '#000000',
            fontSize: '14px',
            overflow: 'hidden',
            textAlign: 'start',
          }}
        >
          <p style={{
            color: 'black',
            padding: '0',
            margin: '0',
            lineHeight: `${dimensions.set.width}px`,
          }}
          >
            {size}
          </p>
        </foreignObject>
      )}
      <rect
        fill="#636363"
        stroke="#fff"
        strokeWidth="0px"
        height={barSize}
        width={dimensions.set.width - 1} // -1 to add half a pixel of spacing on each side
        opacity={foregroundOpacity}
        z={2}
        transform={translate(
          0.5, // Center the bar so there's a half pixel of spacing on each side
          dimensions.set.size.height - barSize,
        )}
      />
      {(showSize && !hideSizeText && size > 0) && (
        <foreignObject
          transform={`${translate(0, dimensions.set.label.height - 2)}rotate(-90)`}
          height={dimensions.set.width}
          width={dimensions.set.label.height - (dimensions.set.width / 2)}
          z={3}
          style={{
            color: '#000000',
            fontSize: '14px',
            overflow: 'hidden',
            textAlign: 'start',
          }}
        >
          <p style={{
            color: 'white',
            padding: '0',
            margin: '0',
            lineHeight: `${dimensions.set.width}px`,
            maxWidth: `${barSize - 2}px`,
            overflow: 'hidden',
          }}
          >
            {size}
          </p>
        </foreignObject>
      )}
      {showLabel && (
        <foreignObject
          transform={`${translate(0, dimensions.set.label.height - 2)}rotate(-90)`}
          height={dimensions.set.width}
          width={dimensions.set.label.height - (dimensions.set.width / 2)}
          z={100}
          style={{
            color: '#000000',
            fontSize: '14px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            textAlign: 'start',
          }}
        >
          <p style={{
            padding: '0',
            margin: '0',
          }}
          >
            {label}
          </p>
        </foreignObject>
      )}
    </Group>
  );
};
