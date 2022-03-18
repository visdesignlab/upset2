/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';

type Props = {
  label: string;
  sort?: boolean;
};

export const AttributeButton: FC<Props> = ({ label, sort = false }) => {
  const dimensions = useRecoilValue(dimensionsSelector);

  return (
    <g>
      <rect
        css={{
          fill: '#ccc',
          stroke: 'black',
          opacity: 0.5,
          'stroke-width': ' 0.3px',
          '&:hover': {
            opacity: 0.7,
          },
        }}
        height={dimensions.attribute.buttonHeight}
        width={dimensions.attribute.width}
      />
      <text
        css={css`
          cursor: s-resize;
        `}
        pointerEvents={sort ? 'default' : 'none'}
        dominantBaseline="middle"
        transform={translate(
          dimensions.attribute.width / 2,
          dimensions.attribute.buttonHeight / 2,
        )}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
};
