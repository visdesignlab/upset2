/** @jsxImportSource @emotion/react */
import { styled } from '@mui/material';
import { ComponentProps, FC } from 'react';

import translate from '../../utils/transform';

const ButtonRect = styled('rect')({
  fill: '#ccc',
  stroke: 'black',
  opacity: 0.5,
  strokeWidth: '0.3px',
  '&:hover': {
    opacity: 1,
  },
});

type Props = ComponentProps<typeof ButtonRect> & {
  label: string;
  height: number;
  width: number;
  autoWidth?: boolean;
  tx?: number;
  ty?: number;
};

export const SvgRectButton: FC<Props> = ({
  label,
  height,
  width,
  tx = 0,
  ty = tx,
  autoWidth = false,
  ...props
}) => {
  return (
    <g transform={translate(tx - width / 2, ty)}>
      <ButtonRect height={height} width={width} {...props} />
      <text
        transform={translate(width / 2, height / 2)}
        dominantBaseline="middle"
        textAnchor="middle"
        pointerEvents="none"
      >
        {label}
      </text>
    </g>
  );
};
