import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../atoms/dimensionsAtom';
import translate from '../utils/transform';
import { MatrixRows } from './MatrixRows';
import { flattenedRowsSelector } from '../atoms/renderRowsAtom';

export const Body = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const rows = useRecoilValue(flattenedRowsSelector);

  return (
    <g transform={translate(0, dimensions.header.totalHeight + 5)}>
      <MatrixRows rows={rows} />
    </g>
  );
};
