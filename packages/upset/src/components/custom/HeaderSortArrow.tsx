import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { SvgIcon } from '@mui/material';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { sortByOrderSelector } from '../../atoms/config/sortByAtom';
import translate from '../../utils/transform';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';

type Props = {
  translateX?: number;
  translateY?: number;
}

export const HeaderSortArrow: FC<Props> = ({ translateX, translateY }) => {
  const sortByOrder = useRecoilValue(sortByOrderSelector);

  const dimensions = useRecoilValue(dimensionsSelector);

  const height = 16;
  const width = 16;

  if (translateX === undefined) {
    translateX = dimensions.attribute.width / 2 - width;
  }

  if (translateY === undefined) {
    translateY = -(height / 2);
  }

  return (
    <g
      transform={`${translate(translateX, translateY)}`}
    >
      <SvgIcon
        height={`${height}px`}
        width={`${width}px`}
        component={sortByOrder === 'Ascending' ? ArrowUpward : ArrowDownward}
      />
    </g>
  );
};
