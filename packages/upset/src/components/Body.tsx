import React from 'react';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { flattenedRowsSelector } from '../atoms/renderRowsAtom';
import translate from '../utils/transform';
import { BackgroundRects } from './BackgroundRects';
import { ForegroundRects } from './ForegroundRects';
import { MatrixRows } from './MatrixRows';

export const Body = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const rows = useRecoilValue(flattenedRowsSelector);

  return (
    <g transform={translate(0, dimensions.header.height() + 5)}>
      <BackgroundRects />
      <MatrixRows rows={rows} />
      <ForegroundRects />
    </g>
  );
};
