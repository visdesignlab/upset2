import React, { useContext } from 'react';
import { UpsetContext } from '../context/UpsetContext';
import translate from '../utils/transform';
import { BackgroundRects } from './BackgroundRects';
import { CardinalityBar } from './CardinalityBars';
import { Matrix } from './Matrix';

export const Body = () => {
  const context = useContext(UpsetContext);
  const { dimensions, visibleSets, subsets } = context;

  return (
    <>
      <g transform={translate(0, dimensions.header.height() + 5)}>
        <BackgroundRects />
        {Object.values(subsets).map((subset, idx) => (
          <g
            key={subset.id}
            transform={translate(0, idx * dimensions.body.rowHeight)}
          >
            <Matrix sets={visibleSets} subset={subset} />
            <CardinalityBar size={subset.size} />
          </g>
        ))}
      </g>
    </>
  );
};
