import { css } from '@emotion/react';
import { ScaleLinear } from 'd3';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import Group from './Group';
import { columnHoverAtom, columnSelectAtom } from '../../atoms/highlightAtom';
import { hoverHighlight } from '../../utils/styles';

/** @jsxImportSource @emotion/react */
const matrixColumnBackgroundRect = css`
  fill: #f0f0f0;
`;
const matrixColumnForegroundRect = css`
  fill: #636363;
  stroke: #fff;
  stroke-width: 1px;
`;

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
        {label} - {size}
      </title>

      <rect
        css={
          columnHover.includes(setId) || columnSelect.includes(setId)
            ? hoverHighlight
            : matrixColumnBackgroundRect
        }
        height={dimensions.set.size.height}
        width={dimensions.set.width}
        stroke="none"
        fill="gray"
      />
      <rect
        css={css`
          ${matrixColumnForegroundRect}
        `}
        height={scale(size)}
        width={dimensions.set.width}
        stroke="none"
        fill="gray"
        opacity={foregroundOpacity}
        transform={translate(
          0,
          dimensions.set.size.height - scale(size),
        )}
      />
      {showLabel && (
        <foreignObject
          transform={`${translate(0 , dimensions.set.label.height - 2)}rotate(-90)`}
          height={dimensions.set.width}
          width={dimensions.set.label.height - (dimensions.set.width / 2)}
          z={100}
        >
          <p css={css`
            color: #000000; 
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis;
            padding: 0;
            margin: 0; 
          `}>{label}</p>
        </foreignObject>
      )}
    </Group>
  );
};
