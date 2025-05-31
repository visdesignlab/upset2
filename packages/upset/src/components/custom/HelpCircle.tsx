import { QuestionMark } from '@mui/icons-material';
import { Tooltip, IconButton } from '@mui/material';
import { CSSProperties } from 'react';

type Margin = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export const defaultMargin: Margin = {
  top: 0,
  bottom: 1,
  left: 0,
  right: 2.5,
};

export const HelpCircle = ({
  text,
  margin = { ...defaultMargin },
  size = 13,
  style = undefined,
}: {
  text: string;
  margin?: Margin;
  size?: number;
  style?: CSSProperties;
}) => (
  <Tooltip title={text} placement="top" arrow style={style}>
    <IconButton
      sx={{
        alignSelf: 'center',
        margin: `${margin.top}px ${margin.right}px ${margin.bottom}px ${margin.left}px`,
        padding: '3px',
      }}
      disableTouchRipple
      aria-hidden
    >
      <QuestionMark sx={{ height: size, width: size }} />
    </IconButton>
  </Tooltip>
);
