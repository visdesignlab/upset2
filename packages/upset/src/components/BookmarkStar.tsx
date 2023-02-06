import { Row } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import StarIcon from '@mui/icons-material/Star'
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import translate from '../utils/transform';
import { bookmarkedColorPalette, currentIntersectionAtom } from '../atoms/config/currentIntersectionAtom';
import { css } from '@emotion/react';

type Props = {
    row: Row;
}

export const BookmarkStar: FC<Props> = ({ row }) => {
    const dimensions = useRecoilValue(dimensionsSelector);
    const colorPallete = useRecoilValue(bookmarkedColorPalette);
    const setCurrentIntersectionAtom = useSetRecoilState(currentIntersectionAtom);

    return (<g 
        onClick={() => row && (setCurrentIntersectionAtom(row))}
        transform={translate(
            dimensions.matrixColumn.width + 
            dimensions.bookmarkStar.gap +
            dimensions.bookmarkStar.gap / 2 +
            dimensions.cardinality.width + 
            dimensions.bookmarkStar.gap,
            0)}
            css={css`cursor:pointer;`}>
                <StarIcon height={dimensions.body.rowHeight} width={dimensions.set.width} fontSize={'1em' as any} sx={{ color: colorPallete[row.id] }}/>
            </g>)
}