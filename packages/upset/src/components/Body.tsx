import { Subset } from '@visdesignlab/upset2-core';
import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { renderRowSelector } from '../atoms/renderRowsAtom';
import { visibleSetsAtom } from '../atoms/setsAtoms';
import { subsetSelector } from '../atoms/subsetAtoms';
import translate from '../utils/transform';
import { BackgroundRects } from './BackgroundRects';
import { CardinalityBar } from './CardinalityBars';
import { Matrix } from './Matrix';

export const Body = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleSets = useRecoilValue(visibleSetsAtom);
  const subsets = useRecoilValue(renderRowSelector);

  return (
    <g transform={translate(0, dimensions.header.height() + 5)}>
      <BackgroundRects />
      {subsets.order.map((subsetId, idx) => (
        <g
          key={subsetId}
          transform={translate(0, idx * dimensions.body.rowHeight)}
        >
          <Matrix
            sets={visibleSets}
            subset={subsets.values[subsetId] as Subset}
          />
          <CardinalityBar size={subsets.values[subsetId].size} />
        </g>
      ))}
    </g>
  );
};
