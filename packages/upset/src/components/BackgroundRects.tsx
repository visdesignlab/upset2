import React, { useContext } from 'react';
import { UpsetContext } from '../context/UpsetContext';
import translate from '../utils/transform';

export const BackgroundRects = () => {
  const context = useContext(UpsetContext);
  const { dimensions, visibleSets, subsets } = context;

  return (
    <>
      <g
        className="background-columns"
        transform={translate(dimensions.header.matrixColumn.labelHeight, 0)}
      >
        {visibleSets.map((setName, idx) => (
          <g
            key={setName}
            transform={translate(idx * dimensions.body.rowHeight, 0)}
          >
            <rect
              className={setName}
              height={dimensions.body.height()}
              width={dimensions.header.matrixColumn.barWidth}
              stroke="black"
              strokeWidth="0.3"
              fill="none"
              opacity="0.2"
            />
          </g>
        ))}
      </g>
      <g
        className="background-rows"
        transform={translate(dimensions.header.matrixColumn.labelHeight, 0)}
      >
        {Object.values(subsets).map((subset, idx) => (
          <g
            key={subset.id}
            transform={translate(0, idx * dimensions.body.rowHeight)}
          >
            <rect
              key={subset.id}
              className={subset.id}
              height={dimensions.body.rowHeight}
              width={dimensions.body.rowWidth}
              stroke="black"
              strokeWidth="0.3"
              fill="none"
              opacity="0.2"
            />
          </g>
        ))}
      </g>
    </>
  );
};
