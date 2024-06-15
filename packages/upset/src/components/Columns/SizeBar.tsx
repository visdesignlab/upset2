import { Row } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { bookmarkedColorPalette, bookmarkSelector, currentSelectionSelector, nextColorSelector } from '../../atoms/config/currentIntersectionAtom';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { maxSize } from '../../atoms/maxSizeAtom';
import { useScale } from '../../hooks/useScale';
import translate from '../../utils/transform';
import { newShade } from '../../utils/colors';

/**
 * A bar that represents the size of a row in the upset plot.
 * @param size The size of the row.
 * @param selected The number of selected items in the row.
 * @param row Row object to display the size for. 
 * @jsxImportSource @emotion/react 
 */
type Props = {
  size: number;
  selected: number;
  row?: Row;
};

const colors = ['rgb(189, 189, 189)', 'rgb(136, 136, 136)', 'rgb(37, 37, 37)'];

export const SizeBar: FC<Props> = ({ row, size, selected }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const sizeDomain = useRecoilValue(maxSize);
  const currentIntersection = useRecoilValue(currentSelectionSelector);
  const bookmarkedIntersections = useRecoilValue(bookmarkSelector);
  const bookmarkedColorPallete = useRecoilValue(bookmarkedColorPalette);
  const nextColor = useRecoilValue(nextColorSelector);

  const scale = useScale(
    [0, sizeDomain],
    [0, dimensions.attribute.width],
  );

  if (size < 0 || sizeDomain < 0) return null;

  const OFFSET = 6;

  /**
   * Calculates the number of size bars to display based on the size of the row.
   * @param size Size of the row.
   * @returns { fullBars: number, rem: number} 
   *   fullBars  Number of full bars to display.
   *   rem       Remaining size after full bars are displayed.
   */
  function calculateBars(size: number): { fullBars: number; rem: number } {
    let fullBars = size > 0 ? Math.floor(size / sizeDomain) : size;
    const rem = size % sizeDomain;

    if (fullBars >= 3) {
      fullBars = 3;
    }

    return { fullBars, rem };
  }

  //const { fullBars: fullSelectBars, rem: remSelect } = calculateBars(selected);

  const { fullBars, rem } = calculateBars(size);
  const rectArray: number[] = [];
  for (let i = 0; i < fullBars; ++i) {
    rectArray[i] = i;
  }

  /**
   * Gets the fill color for the size bar.
   * @param index Index of the bar.
   * @returns Fill color for the bar.
   */
  function getFillColor(index: number) {
    // if the row is bookmarked, highlight the bar with the bookmark color
    if (row !== undefined && bookmarkedIntersections.some((bookmark) => bookmark.id === row.id)) {
      // darken the color for advanced scale sub-bars
      if (index !== 0) {
        return newShade(bookmarkedColorPallete[row.id], -(12 + (index * 2)));
      }
      return bookmarkedColorPallete[row.id];
    }

    // We don't want to evaluate this to true if both currentIntersection and row are undefined, hence the 1st condition
    if (currentIntersection && currentIntersection?.id === row?.id) { // if currently selected, use the highlight colors
      return nextColor;
    }
    return colors[index];
  }

  return (
    <g
      transform={translate(
        dimensions.matrixColumn.width +
        dimensions.bookmarkStar.gap +
        dimensions.bookmarkStar.width +
        dimensions.bookmarkStar.gap,
        (dimensions.body.rowHeight - dimensions.size.plotHeight) / 2,
      )}
    >
      {rectArray.map((arr) => (
        <rect
          transform={translate(0, (arr * OFFSET) / 2)}
          key={arr}
          height={dimensions.size.plotHeight - arr * OFFSET}
          width={dimensions.attribute.width}
          fill={getFillColor(arr)}
        />
      ))}
      {fullBars < 3 && (
        <rect
          transform={translate(0, (fullBars * OFFSET) / 2)}
          height={dimensions.size.plotHeight - fullBars * OFFSET}
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
