import { ScaleLinear } from 'd3';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import Group from './Group';
import { columnHoverAtom, columnSelectAtom } from '../../atoms/highlightAtom';
import { hoverHighlight } from '../../utils/styles';

type Props = {
  scale: ScaleLinear<number, number>;
  setId: string;
  size: number;
  label: string;
  showLabel?: boolean;
  foregroundOpacity?: number;
  tx?: number;
  ty?: number;
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
}) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const columnHover = useRecoilValue(columnHoverAtom);
  const columnSelect = useRecoilValue(columnSelectAtom);

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
      <rect
        fill="#636363"
        stroke="#fff"
        strokeWidth="1px"
        height={scale(size)}
        width={dimensions.set.width}
        opacity={foregroundOpacity}
        transform={translate(
          0,
          dimensions.set.size.height - scale(size),
        )}
      />
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
          <body style={{ fontFamily: 'Roboto, Arial', padding: 0, margin: 0 }}>
            <p style={{
              padding: '0',
              margin: '0',
            }}
            >
              {label}
            </p>
          </body>
        </foreignObject>
      )}
    </Group>
  );
};
