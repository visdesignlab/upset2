import { Row } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { bookmarkedColorPalette, bookmarkedIntersectionSelector, currentIntersectionAtom } from '../atoms/config/currentIntersectionAtom';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { maxSize } from '../atoms/maxSizeAtom';
import { useScale } from '../hooks/useScale';
import translate from '../utils/transform';
import { newShade } from '../utils/colors';

/** @jsxImportSource @emotion/react */
type Props = {
  size: number;
  row?: Row;
};

const colors = ['rgb(189, 189, 189)', 'rgb(136, 136, 136)', 'rgb(37, 37, 37)'];
const highlightColors = ['rgb(116, 173, 209)', 'rgb(94, 102, 171)', 'rgb(29, 41, 71)'];

export const SizeBar: FC<Props> = ({ row, size }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const sizeDomain = useRecoilValue(maxSize);
  const currentIntersection = useRecoilValue(currentIntersectionAtom);
  const bookmarkedIntersections = useRecoilValue(bookmarkedIntersectionSelector);
  const bookmarkedColorPallete = useRecoilValue(bookmarkedColorPalette);

  const scale = useScale(
    [0, sizeDomain],
    [0, dimensions.attribute.width],
  );

  let fullBars = size > 0 ? Math.floor(size / sizeDomain) : size;
  const rem = size % sizeDomain;

  if (size < 0 || sizeDomain < 0) return null;

  if (fullBars >= 3) {
    fullBars = 3;
  }

  const offset = 6;

  const rectArray: number[] = [];
  for (let i = 0; i < fullBars; ++i) {
    rectArray[i] = i;
  }

  function getFillColor(index: number) {
    // if the row is bookmarked, highlight the bar with the bookmark color
    if (row !== undefined && bookmarkedIntersections.some((bookmark) => bookmark.id === row.id)) {
      // darken the color for advanced scale sub-bars
      if (index !== 0) {
        return newShade(bookmarkedColorPallete[row.id], -(12 + (index * 2)));
      }
      return bookmarkedColorPallete[row.id];
    }

    if (row !== undefined && currentIntersection !== null && currentIntersection.id === row.id) { // if currently selected, use the highlight colors
      return highlightColors[index];
    }
    return colors[index];
  }

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
        dimensions.bookmarkStar.gap +
        dimensions.bookmarkStar.width +
        dimensions.bookmarkStar.gap +
        dimensions.degreeColumn.width +
        dimensions.degreeColumn.gap,
        (dimensions.body.rowHeight - dimensions.size.plotHeight) / 2,
      )}
    >
      {rectArray.map((arr) => (
        <rect
          transform={translate(0, (arr * offset) / 2)}
          key={arr}
          height={dimensions.size.plotHeight - arr * offset}
          width={dimensions.attribute.width}
          fill={getFillColor(arr)}
        />
      ))}
      {fullBars < 3 && (
        <rect
          transform={translate(0, (fullBars * offset) / 2)}
          height={dimensions.size.plotHeight - fullBars * offset}
          width={scale(rem)}
          fill={getFillColor(fullBars)}
        />
      )}
      {fullBars === 3 && (
        <>
          <line
            stroke="white"
            strokeWidth="2px"
            x1={dimensions.attribute.width * 0.8}
            x2={dimensions.attribute.width * 0.85}
            y1={0}
            y2={dimensions.body.rowHeight}
          />
          <line
            stroke="white"
            strokeWidth="2px"
            x1={dimensions.attribute.width * 0.78}
            x2={dimensions.attribute.width * 0.83}
            y1={0}
            y2={dimensions.body.rowHeight}
          />
        </>
      )}
      <text
        textAnchor="start"
        dominantBaseline="middle"
        transform={translate(
          (fullBars > 0 ? dimensions.attribute.width : scale(rem)) + 5,
          dimensions.body.rowHeight / 2,
        )}
      >
        {size}
      </text>
    </g>
  );
};
