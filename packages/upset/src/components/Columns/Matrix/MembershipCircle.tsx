import { useTheme } from '@mui/material';
import { SetMembershipStatus } from '@visdesignlab/upset2-core';
import { FC, SVGProps } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../../atoms/dimensionsAtom';

type Props = SVGProps<SVGCircleElement> & {
  membershipStatus: SetMembershipStatus;
  showoutline: boolean;
};

const MemberShipCircle: FC<Props> = (props) => {
  const { membershipStatus, showoutline, ...base } = props;
  const theme = useTheme();
  const dimensions = useRecoilValue(dimensionsSelector);

  return (
    <>
      <circle
        {...base}
        stroke={
          showoutline && membershipStatus !== 'Yes'
            ? theme.matrix.member.yes
            : theme.matrix.member.no
        }
        fill={
          ['No', 'May'].includes(membershipStatus)
            ? theme.matrix.member.no
            : theme.matrix.member.yes
        }
        r={(dimensions.set.width - 5) / 2}
      />
      {membershipStatus === 'May' && (
        <circle {...base} fill={theme.matrix.member.yes} strokeOpacity={0} r={3} />
      )}
    </>
  );
};

export default MemberShipCircle;
