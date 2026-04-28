import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { SvgIcon } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { sortByOrderSelector } from '../../atoms/config/sortByAtom';
import translate from '../../utils/transform';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';

type Props = {
  translateX?: number;
  translateY?: number;
};

export function HeaderSortArrow({ translateX, translateY }: Props) {
  const sortByOrder = useRecoilValue(sortByOrderSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const height = 16;
  const width = 16;
  const x = translateX ?? (dimensions.attribute.width / 2 - width);
  const y = translateY ?? -(height / 2);

  return (
    <g transform={translate(x, y)}>
      <SvgIcon
        height={`${height}px`}
        width={`${width}px`}
        component={sortByOrder === 'Ascending' ? ArrowUpward : ArrowDownward}
      />
    </g>
  );
}
