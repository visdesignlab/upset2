import { flattenedRows } from '@visdesignlab/upset2-core';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../atoms/dimensionsAtom';
import translate from '../utils/transform';
import { MatrixRows } from './MatrixRows';
import { dataAtom } from '../atoms/dataAtom';
import { upsetConfigAtom } from '../atoms/config/upsetConfigAtoms';

export const Body = () => {
  const data = useRecoilValue(dataAtom);
  const dimensions = useRecoilValue(dimensionsSelector);
  const state = useRecoilValue(upsetConfigAtom);
  const rows = flattenedRows(data, state);

  return (
    <g transform={translate(0, dimensions.header.totalHeight + 5)}>
      <MatrixRows rows={rows} />
    </g>
  );
};
