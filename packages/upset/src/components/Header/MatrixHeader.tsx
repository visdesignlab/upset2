/** @jsxImportSource @emotion/react */
import { useRecoilValue } from 'recoil';

import { hiddenSetSelector, visibleSetSelector } from '../../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { maxSetSizeSelector } from '../../atoms/maxSetSizeSelector';
import { useScale } from '../../hooks/useScale';
import { SetHeader } from './SetHeader';
import { HiddenSets } from './HiddenSets';

export const MatrixHeader = () => {
  const visibleSets = useRecoilValue(visibleSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const maxCarinality = useRecoilValue(maxSetSizeSelector);
  const hiddenSets = useRecoilValue(hiddenSetSelector);

  const { set } = dimensions;

  const scale = useScale([0, maxCarinality], [0, set.cardinality.height]);

  return (
    <>
      <SetHeader visibleSets={visibleSets} scale={scale} />
      <HiddenSets hiddenSets={hiddenSets} scale={scale}/>
    </>
  );
};
