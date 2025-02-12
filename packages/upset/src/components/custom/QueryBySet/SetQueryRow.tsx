import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../../atoms/dimensionsAtom';
import translate from '../../../utils/transform';

export const SetQueryRow: FC = () => {
  const dimensions = useRecoilValue(dimensionsSelector);

  return (
    <g>
      <g>
        <rect
          transform={translate(0, 2)}
          height={dimensions.body.rowHeight - 4}
          width={dimensions.body.rowWidth}
          rx={5}
          ry={10}
          fill="#cccccc"
          opacity="0.3"
          stroke="#555555"
          strokeWidth="1px"
        />
      </g>
    </g>
  );
};
