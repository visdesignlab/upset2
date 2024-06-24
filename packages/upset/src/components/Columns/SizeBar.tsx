import { Row } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { bookmarkedColorPalette, bookmarkedIntersectionSelector, currentIntersectionSelector, elementColorSelector, nextColorSelector } from '../../atoms/config/currentIntersectionAtom';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { maxSize } from '../../atoms/maxSizeAtom';
import { useScale } from '../../hooks/useScale';
import translate from '../../utils/transform';
import { newShade } from '../../utils/colors';

/**
 * A bar that represents the size of a row in the upset plot.
 * @param size The size of the row.
 * @param selected The number of selected items in the row.
 * @param selectedColor The color to use for the element selection in this bar, if extant
 * @param row Row object to display the size for. 
 * @jsxImportSource @emotion/react 
 */
type Props = {
  /** Row size (element count) */
  size: number;
  /** Number of selected items in the row; should be <= size */
  selected: number;
  /** Row object which the size is being displayed for */
  row?: Row;
};

/**
 * A rectangle in the size bar. Used to create an svg <rect> element
 */
type Rect = {
  /** SVG transform */
  transform: string;
  /** Bar height */
  height: number;
  /** Bar width */
  width: number;
  /** Hex fill color */
  fillColor: string;
}

const colors = ['rgb(189, 189, 189)', 'rgb(136, 136, 136)', 'rgb(37, 37, 37)'];

export const SizeBar: FC<Props> = ({ row, size, selected }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const sizeDomain = useRecoilValue(maxSize);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);
  const bookmarkedIntersections = useRecoilValue(bookmarkedIntersectionSelector);
  const bookmarkedColorPallete = useRecoilValue(bookmarkedColorPalette);
  const nextColor = useRecoilValue(nextColorSelector);
  const elementSelectionColor = useRecoilValue(elementColorSelector);

  /**
   * Darkens a size bar color according to its nesting index.
   * Used to darken the interior size bars when more than one size bar is necessary.
   * @param index Index of the size bar: 0 is the lowermost/first bar, not nested.
   *   In a size bar with no nested bars, the only index is 0.
   *   If index is 0, the initial color is returned unmodified.
   * @param color The initial color of the bar; to be darkened.
   */
  function darkenColor(index: number, color: string): string {
    return index === 0 ? color : newShade(color, -(12 + (index * 2)));
  }

  /**
   * Gets the fill color for the size bar.
   * @param index Index of the bar.
   * @returns Fill color for the bar.
   */
  function getFillColor(index: number): string {
    // if the row is bookmarked, highlight the bar with the bookmark color
    if (row !== undefined && bookmarkedIntersections.some((bookmark) => bookmark.id === row.id)) {
      // darken the color for advanced scale sub-bars
      return darkenColor(index, bookmarkedColorPallete[row.id]);
    }

    // We don't want to evaluate this to true if both currentIntersection and row are undefined, hence the 1st condition
    if (currentIntersection && currentIntersection?.id === row?.id) { // if currently selected, use the highlight colors
      return nextColor;
    }
    return colors[index];
  }

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

  // Compute vars for size bars
  const scale = useScale(
    [0, sizeDomain],
    [0, dimensions.attribute.width],
  );
  if (size < 0 || sizeDomain < 0) return null;
  const OFFSET = 6;
  const { fullBars, rem } = calculateBars(size);

  // Compute vars for selected size bars
  const { fullBars: fullSelectBars, rem: remSelect } = calculateBars(selected);

  // Calculate all rectangles for the size bar
  const rectArray: Rect[] = [];
  for (let i = 0; i < 3; ++i) {
    if (i < fullBars)
      rectArray.push({
        transform: translate(0, (i * OFFSET) / 2),
        height: dimensions.size.plotHeight - i * OFFSET,
        width: dimensions.attribute.width,
        fillColor: i < fullSelectBars ? darkenColor(i, elementSelectionColor) : getFillColor(i)
      })
    else if (i === fullBars)
      rectArray.push({
        transform: translate(0, (fullBars * OFFSET) / 2),
        height: dimensions.size.plotHeight - fullBars * OFFSET,
        width: scale(rem),
        fillColor: getFillColor(fullBars),
      });
    if (i === fullSelectBars)
      rectArray.push({
        transform: translate(0, (fullSelectBars * OFFSET) / 2),
        height: dimensions.size.plotHeight - fullSelectBars * OFFSET,
        width: scale(remSelect),
        fillColor: darkenColor(fullSelectBars, elementSelectionColor),
      });
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
      {rectArray.map((rect) => (
        <rect
          transform={rect.transform}
          width={rect.width}
          height={rect.height}
          fill={rect.fillColor}
        />
      ))}
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
