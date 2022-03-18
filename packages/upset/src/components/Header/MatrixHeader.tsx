/** @jsxImportSource @emotion/react */
import { useContext } from 'react';
import { a, useTransition } from 'react-spring';
import { useRecoilValue } from 'recoil';

import { hiddenSetSelector, visibleSetSelector } from '../../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { maxSetSizeSelector } from '../../atoms/maxSetSizeSelector';
import { setsAtom } from '../../atoms/setsAtoms';
import { useScale } from '../../hooks/useScale';
import translate from '../../utils/transform';
import Group from '../custom/Group';
import { SetSizeBar } from '../custom/SetSizeBar';
import { ProvenanceContext } from '../Root';
import { SetHeader } from './SetHeader';
import { SetManagement } from './SetManagement';

export const MatrixHeader = () => {
  const { actions } = useContext(ProvenanceContext);
  const sets = useRecoilValue(setsAtom);
  const visibleSets = useRecoilValue(visibleSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const maxCarinality = useRecoilValue(maxSetSizeSelector);
  const { set } = dimensions;

  const hiddenSets = useRecoilValue(hiddenSetSelector);

  const hiddenSetsTransition = useTransition(
    hiddenSets.map((setId, idx) => ({ id: setId, x: idx * (set.width + 1) })),
    {
      keys: (d) => d.id,
      enter: ({ x }) => ({ transform: translate(x, 0) }),
      update: ({ x }) => ({ transform: translate(x, 0) }),
    },
  );

  const scale = useScale([0, maxCarinality], [0, set.cardinality.height]);

  return (
    <>
      <SetHeader visibleSets={visibleSets} scale={scale} />
      <SetManagement />
      <Group
        tx={
          dimensions.matrixColumn.visibleSetsWidth +
          dimensions.gap +
          dimensions.matrixColumn.setManagementWidth +
          dimensions.gap
        }
        ty={0}
      >
        {hiddenSetsTransition(({ transform }, item) => {
          return (
            <a.g
              transform={transform}
              onClick={() => actions.addVisibleSet(item.id)}
            >
              <SetSizeBar
                scale={scale}
                setId={item.id}
                size={sets[item.id].size}
                foregroundOpacity={0.4}
                label={sets[item.id].elementName}
                showLabel
              />
            </a.g>
          );
        })}
      </Group>
    </>
  );
};
