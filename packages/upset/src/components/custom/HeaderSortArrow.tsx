import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { SvgIcon } from '@mui/material';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { sortByOrderSelector } from '../../atoms/config/sortByAtom';
import translate from '../../utils/transform';

type Props = {
  translateX: number;
  translateY: number;
}

export const HeaderSortArrow: FC<Props> = ({ translateX, translateY }) => {
  const sortByOrder = useRecoilValue(sortByOrderSelector);

  return (
    <g
      transform={`${translate(translateX, translateY)}`}
    >
      <SvgIcon
        height="16px"
        width="16px"
        component={sortByOrder === 'Ascending' ? ArrowUpward : ArrowDownward}
      />
    </g>
  );
};
