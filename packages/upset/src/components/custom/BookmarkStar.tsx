import { Row } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import StarIcon from '@mui/icons-material/Star';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import translate from '../../utils/transform';
import { bookmarkedColorPalette } from '../../atoms/config/currentIntersectionAtom';

type Props = {
    row: Row;
}

export const BookmarkStar: FC<Props> = ({ row }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const colorPallete = useRecoilValue(bookmarkedColorPalette);

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
        dimensions.bookmarkStar.gap,
        0,
      )}
    >
      <StarIcon height={dimensions.body.rowHeight} width={dimensions.set.width} fontSize={'1em' as any} sx={{ color: colorPallete[row.id] }} />
    </g>
  );
};
