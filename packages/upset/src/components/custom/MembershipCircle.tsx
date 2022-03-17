import { useTheme } from '@mui/material';
import { SetMembershipStatus } from '@visdesignlab/upset2-core';
import { FC, SVGProps } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';

type Props = SVGProps<SVGCircleElement> & {
  membershipStatus: SetMembershipStatus;
};

const MemberShipCircle: FC<Props> = (props) => {
  const { membershipStatus, ...base } = props;
  const theme = useTheme();
  const dimensions = useRecoilValue(dimensionsSelector);

  return (
    <circle
      {...base}
      fill={
        membershipStatus === 'No'
          ? theme.matrix.member.no
          : theme.matrix.member.yes
      }
      r={membershipStatus === 'May' ? '4' : (dimensions.set.width - 5) / 2}
    />
  );
};

export default MemberShipCircle;
