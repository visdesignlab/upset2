import { useTheme } from '@mui/material';
import { SVGProps } from 'react';

type Props = SVGProps<SVGLineElement>;
// Connecting line between the set membership circles
function ConnectingLine(props: Props) {
  const theme = useTheme();
  return <line {...props} stroke={theme.matrix.member.yes} strokeWidth="3" />;
}

export default ConnectingLine;
