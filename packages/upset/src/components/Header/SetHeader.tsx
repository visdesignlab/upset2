import { ScaleLinear } from 'd3';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { setsAtom } from '../../atoms/setsAtoms';
import Group from '../custom/Group';
import { SetLabel } from '../custom/SetLabel';
import { SetSizeBar } from '../custom/SetSizeBar';

type Props = {
  visibleSets: string[];
  scale: ScaleLinear<number, number>;
};

export const SetHeader: FC<Props> = ({ visibleSets, scale }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const sets = useRecoilValue(setsAtom);

  return (
    <g>
      {visibleSets.map((setName, idx) => (
        <Group key={setName} tx={idx * dimensions.set.width} ty={0}>
          <SetSizeBar
            scale={scale}
            size={sets[setName].size}
            setId={setName}
            label={sets[setName].elementName}
          />
          <SetLabel setId={setName} name={sets[setName].elementName} />
        </Group>
      ))}
    </g>
  );
};
