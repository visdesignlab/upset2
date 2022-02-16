import { Subset } from '@visdesignlab/upset2-core';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import { visibleSetsAtom } from '../atoms/setsAtoms';
import { CardinalityBar } from './CardinalityBars';
import { DeviationBar } from './DeviationBars';
import { Matrix } from './Matrix';

type Props = {
  subset: Subset;
};

export const SubsetRow: FC<Props> = ({ subset }) => {
  const visibleSets = useRecoilValue(visibleSetsAtom);

  return (
    <>
      <Matrix sets={visibleSets} subset={subset} />
      <CardinalityBar size={subset.size} />
      <DeviationBar deviation={subset.deviation} />
    </>
  );
};
