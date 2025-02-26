import { useRecoilValue } from 'recoil';

import { isPopulatedSetQuery } from '@visdesignlab/upset2-core';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import translate from '../utils/transform';
import { MatrixRows } from './Rows/MatrixRows';
import { flattenedRowsSelector } from '../atoms/renderRowsAtom';
import { QueryBySetInterface } from './custom/QueryBySet/QueryBySetInterface';
import { SetQueryRow } from './custom/QueryBySet/SetQueryRow';
import { queryBySetsInterfaceAtom, setQueryAtom } from '../atoms/config/queryBySetsAtoms';

export const Body = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const rows = useRecoilValue(flattenedRowsSelector);
  const queryBySetInterface = useRecoilValue(queryBySetsInterfaceAtom);
  const setQuery = useRecoilValue(setQueryAtom);

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
        (
          <g>
            { queryBySetInterface && <QueryBySetInterface /> }
            { isPopulatedSetQuery(setQuery) ? <SetQueryRow /> : null }
            <MatrixRows rows={rows} />
          </g>
        )}
    </g>
  );
};
