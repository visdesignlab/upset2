import React from 'react';
import { CardinalityHeader } from './CardinalityHeader';
import { MatrixHeader } from './MatrixHeader';

export const Header = () => {
  return (
    <>
      <MatrixHeader />
      <CardinalityHeader />
    </>
  );
};
