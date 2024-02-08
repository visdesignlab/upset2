import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import translate from '../utils/transform';

type Props = {
  degree: number;
}

export const Degree: FC<Props> = ({ degree }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
        dimensions.bookmarkStar.gap +
        dimensions.bookmarkStar.width +
        dimensions.bookmarkStar.gap,
        dimensions.body.rowHeight / 2 + 5,
      )}
    >
      <text>
        {degree}
      </text>
    </g>
  );
};
