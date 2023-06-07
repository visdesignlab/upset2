import { css } from '@emotion/react';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import Group from './Group';
import { columnHoverAtom } from '../../atoms/hoverAtom';
import { hoverHighlight } from '../../utils/styles';

type Props = {
  setId: string;
  name: string;
};

/** @jsxImportSource @emotion/react */
const matrixColumnBackgroundRect = css`
  fill: #f0f0f0;
`;

export const SetLabel: FC<Props> = ({ setId, name }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const columnHover = useRecoilValue(columnHoverAtom);

  const gap = 4;

  return (
    <Group tx={0} ty={dimensions.set.cardinality.height}>
      <rect
        className={setId}
        css={columnHover === setId ? hoverHighlight : matrixColumnBackgroundRect}
        height={dimensions.set.label.height - gap}
        width={dimensions.set.width - gap / 2}
        transform={`${translate(
          dimensions.xOffset + gap/2,
          gap
        )}`}
      />
      <foreignObject
          transform={`${translate(dimensions.xOffset - dimensions.set.width / 2 - gap / 2, dimensions.set.label.height - 2)}rotate(-90)`}
          height={dimensions.set.width * 2}
          width={dimensions.set.label.height - dimensions.set.width}
          z={100}
        >
          <p css={css`
            color: #000000; 
            font-size: 14px;
            overflow: hidden;
            text-overflow: ellipsis; 
            font-weight: 500;
            height: 100%;
          `}>{name}</p>
        </foreignObject>
    </Group>
  );
};
