/** @jsxImportSource @emotion/react */
import { useRecoilValue } from 'recoil';

import { hiddenSetSelector, visibleSetSelector } from '../../atoms/config/visibleSetsAtoms';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { maxSetSizeSelector } from '../../atoms/maxSetSizeSelector';
import { useScale } from '../../hooks/useScale';
import { SetHeader } from './SetHeader';
import { HiddenSets } from './HiddenSets';
import { css } from '@emotion/react';
import translate from '../../utils/transform';

export const MatrixHeader = () => {
  const visibleSets = useRecoilValue(visibleSetSelector);
  const dimensions = useRecoilValue(dimensionsSelector);
  const maxSize = useRecoilValue(maxSetSizeSelector);
  const hiddenSets = useRecoilValue(hiddenSetSelector);

  const { set } = dimensions;

  const scale = useScale([0, maxSize], [0, set.size.height]);

  return (
    <>
      <SetHeader visibleSets={visibleSets} scale={scale} />
      <foreignObject
      transform={translate(dimensions.matrixColumn.width +
        dimensions.bookmarkStar.gap +
        dimensions.bookmarkStar.width +
        dimensions.bookmarkStar.gap, 0)}
      css={css`
        width: ${
          dimensions.size.width +
          dimensions.gap + 
          dimensions.attribute.width}px;
        height: ${dimensions.set.size.height + 15}px;
      `}>
        <div id="hiddenSetDiv"
        css={css`
          overflow-x: auto;
          overflow-y: hidden;
          height: 100%;
        `}>
          <svg width={hiddenSets.length * (set.width + 1)}>
            <HiddenSets hiddenSets={hiddenSets} scale={scale}/>
          </svg>
        </div>
      </foreignObject>
    </>
  );
};
