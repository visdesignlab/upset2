import { useRecoilValue } from 'recoil';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { visibleSetsAtom } from '../atoms/setsAtoms';
import { subsetSelector } from '../atoms/subsetAtoms';
import translate from '../utils/transform';

export const BackgroundRects = () => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const visibleSets = useRecoilValue(visibleSetsAtom);
  const subsets = useRecoilValue(subsetSelector);

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
        {subsets.order.map((subsetId, idx) => (
          <g
            key={subsetId}
            transform={translate(0, idx * dimensions.body.rowHeight)}
          >
            <rect
              key={subsetId}
              className={subsetId}
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
