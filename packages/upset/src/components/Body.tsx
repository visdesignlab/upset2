import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../atoms/dimensionsAtom';
import translate from '../utils/transform';
import { MatrixRows } from './Rows/MatrixRows';
import { flattenedRowsSelector } from '../atoms/renderRowsAtom';

export const Body = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const rows = useRecoilValue(flattenedRowsSelector);

  return (
    <g transform={translate(0, dimensions.header.totalHeight + 5)}>
      { rows.length === 0 ?
        <text
          transform={
            translate(
              dimensions.matrixColumn.width +
              dimensions.bookmarkStar.gap +
              dimensions.bookmarkStar.width +
              dimensions.bookmarkStar.gap,
              dimensions.body.rowHeight,
            )
}
          style={{ zIndex: 10 }}
        >
          No intersections to display...
        </text> :
        <MatrixRows rows={rows} />}
    </g>
  );
};
