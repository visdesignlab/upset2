import React from 'react';

import { AttributeHeaders } from './AttributeHeaders';
import { CardinalityHeader } from './CardinalityHeader';
import { DeviationHeader } from './DeviationHeader';
import { MatrixHeader } from './MatrixHeader';
import { CollapseAllButton } from './CollapseAllButton';

export const Header = () => (
  <>
    <CollapseAllButton />
    <MatrixHeader />
    <CardinalityHeader />
    <DeviationHeader />
    <AttributeHeaders />
  </>
);
