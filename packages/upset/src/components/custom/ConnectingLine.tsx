import { useTheme } from '@mui/material';
import { FC, SVGProps } from 'react';

type Props = SVGProps<SVGLineElement>;

const ConnectingLine: FC<Props> = (props) => {
  const theme = useTheme();
  return <line {...props} stroke={theme.matrix.member.yes} strokeWidth="3" />;
};

export default ConnectingLine;
