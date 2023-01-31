import { Subset } from '@visdesignlab/upset2-core';
import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { visibleSetSelector } from '../atoms/config/visibleSetsAtoms';
import { AttributeBars } from './AttributeBars';
import { CardinalityBar } from './CardinalityBar';
import { DeviationBar } from './DeviationBar';
import { Matrix } from './Matrix';
import { bookmarkedIntersectionSelector, currentIntersectionAtom, bookmarkedColorPalette } from '../atoms/config/currentIntersectionAtom';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { highlightBackground, defaultBackground } from '../utils/styles';
import StarIcon from '@mui/icons-material/Star';
import translate from '../utils/transform'

type Props = {
  subset: Subset;
};

export const SubsetRow: FC<Props> = ({ subset }) => {
  const visibleSets = useRecoilValue(visibleSetSelector);
  const currentIntersection = useRecoilValue(currentIntersectionAtom);
  const dimensions = useRecoilValue(dimensionsSelector);
  const bookmarkedIntersections = useRecoilValue(bookmarkedIntersectionSelector);
  const colorPallete = useRecoilValue(bookmarkedColorPalette);

  return (
    <>
      <rect height={dimensions.body.rowHeight} width={dimensions.body.rowWidth} css={currentIntersection === subset ? highlightBackground : defaultBackground} rx="5" ry="10"></rect>
      {bookmarkedIntersections.includes(subset.id) &&
        <g transform={translate(dimensions.set.label.height - dimensions.set.width - dimensions.gap,0)}><StarIcon height={dimensions.body.rowHeight} width={dimensions.set.width} fontSize={'1em' as any} sx={{ color: colorPallete[subset.id] }}/></g>
      }
      <Matrix sets={visibleSets} subset={subset} />
      <CardinalityBar size={subset.size} row={subset} />
      <DeviationBar deviation={subset.deviation} />
      <AttributeBars attributes={subset.attributes} />
    </>
  );
};
