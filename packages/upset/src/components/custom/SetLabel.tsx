import { css } from '@emotion/react';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import Group from './Group';

/** @jsxImportSource @emotion/react */
const matrixColumnBackgroundRect = css`
  fill: #f0f0f0;
`;

type Props = {
  setId: string;
  name: string;
};

export const SetLabel: FC<Props> = ({ setId, name }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  return (
    <Group tx={0} ty={dimensions.set.cardinality.height}>
      <rect
        className={setId}
        css={css`
          ${matrixColumnBackgroundRect}
        `}
        height={dimensions.set.label.height}
        width={dimensions.set.width}
        transform={`skewX(${dimensions.set.label.skew})`}
      />
      <text
        css={css`
          font-size: 12px;
        `}
        transform={`${translate(
          dimensions.set.label.height + dimensions.set.width / 2,
          dimensions.set.label.height,
        )}rotate(${dimensions.set.label.skew})`}
        textAnchor="end"
        dominantBaseline="middle"
        pointerEvents="none"
      >
        {name}
      </text>
    </Group>
  );
};
