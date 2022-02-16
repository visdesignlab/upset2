import React from 'react';
import { CardinalityHeader } from './CardinalityHeader';
import { DeviationHeader } from './DeviationHeader';
import { MatrixHeader } from './MatrixHeader';

export const Header = () => (
  <>
    <MatrixHeader />
    <CardinalityHeader />
    <DeviationHeader />
  </>
);
