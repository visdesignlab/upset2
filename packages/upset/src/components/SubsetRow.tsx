import { Subset } from '@visdesignlab/upset2-core';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { AttributeBars } from './AttributeBars';
import { CardinalityBar } from './CardinalityBar';
import { DeviationBar } from './DeviationBar';
import { Matrix } from './Matrix';

type Props = {
  subset: Subset;
};

export const SubsetRow: FC<Props> = ({ subset }) => {
  const visibleSets = useRecoilValue(visibleSetSelector);

  return (
    <>
      <Matrix sets={visibleSets} subset={subset} />
      <CardinalityBar size={subset.size} row={subset} />
      <DeviationBar deviation={subset.deviation} />
      <AttributeBars attributes={subset.attributes} />
    </>
  );
};
