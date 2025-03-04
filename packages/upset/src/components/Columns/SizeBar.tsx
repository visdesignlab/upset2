import { Row } from '@visdesignlab/upset2-core';
import {
  FC, useMemo, JSX, useCallback,
} from 'react';
import { useRecoilValue } from 'recoil';

import {
  bookmarkedColorPalette, bookmarkSelector, currentIntersectionSelector, elementColorSelector, nextColorSelector,
} from '../../atoms/config/currentIntersectionAtom';
import { dimensionsSelector } from '../../atoms/dimensionsAtom';
import { maxSize } from '../../atoms/maxSizeAtom';
import { useScale } from '../../hooks/useScale';
import translate from '../../utils/transform';
import { newShade } from '../../utils/colors';
import { showIntersectionSizesSelector } from '../../atoms/config/displayAtoms';

/**
 * A bar that represents the size of a row in the upset plot.
 * @param size The size of the row.
 * @param selected The number of selected items in the row.
 * @param selectedColor The color to use for the element selection in this bar, if extant
 * @param row Row object to display the size for.
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
  /** Opacity of the bar, 0-1 */
  opacity: number;
  /** Unique key for the rect */
  key: string;
}

const colors = ['rgb(189, 189, 189)', 'rgb(136, 136, 136)', 'rgb(37, 37, 37)'];

/**
 * Darkens a size bar color according to its nesting index.
 * Used to darken the interior size bars when more than one size bar is necessary.
 * @param index Index of the size bar: 0 is the lowermost/first bar, not nested.
 *   In a size bar with no nested bars, the only index is 0.
 *   If index is 0, the initial color is returned unmodified.
 * @param color The initial color of the bar; to be darkened.
 */
function darkenColor(index: number, color: string): string {
  return index === 0 ? color : newShade(color, -(12 + (index * 3)));
}

/*
 * Size bar for a row in the upset plot, showing number of elements in the subset.
 */
export const SizeBar: FC<Props> = ({ row, size, selected }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const sizeDomain = useRecoilValue(maxSize);
  const currentIntersection = useRecoilValue(currentIntersectionSelector);
  const bookmarks = useRecoilValue(bookmarkSelector);
  const bookmarkedColorPallete = useRecoilValue(bookmarkedColorPalette);
  const nextColor = useRecoilValue(nextColorSelector);
  const elementSelectionColor = useRecoilValue(elementColorSelector);
  const showText = useRecoilValue(showIntersectionSizesSelector);

  /*
   * Constants
   */

  // Opacity for the selection color
  const SELECTION_OPACITY = 0.6;
  // Offset in px for each nested bar
  const OFFSET = 6;

  /*
   * Functions
   */

  /**
   * Gets the fill color for the size bar. Returns a bookmark color if the row is bookmarked or selected
   * and has no selected elements; otherwise, returns grey
   * @param index Index of the bar.
   * @returns Fill color for the bar.
   */
  const getFillColor: (index: number) => string = useCallback((index) => {
    // if the row is bookmarked, highlight the bar with the bookmark color
    if (row && selected === 0 && bookmarks.some((bookmark) => bookmark.id === row.id)) {
      // darken the color for advanced scale sub-bars
      return darkenColor(index, bookmarkedColorPallete[row.id]);
    }

    // We don't want to evaluate this to true if both currentIntersection and row are undefined, hence the 1st condition
    if (currentIntersection && selected === 0 && currentIntersection?.id === row?.id) {
      // if currently selected, use the highlight colors
      return nextColor;
    }
    return colors[index];
  }, [row, selected, bookmarks, bookmarkedColorPallete, currentIntersection, nextColor]);


  /**
   * Calculates the number of size bars to display based on the size of the row.
   * @param rowSize Size of the row.
   * @returns { fullBars: number, rem: number}
   *   fullBars  Number of full bars to display.
   *   rem       Remaining size after full bars are displayed.
   */
  const calculateBars: (rowSize: number) => { fullBars: number; rem: number } = useCallback((rowSize) => {
    let fullBars = rowSize > 0 ? Math.floor(rowSize / sizeDomain) : rowSize;
    const rem = rowSize % sizeDomain;

    if (fullBars >= 3) {
      fullBars = 3;
    }

    // If the remainder is 0 and there are 1 or 2 full bars, remove a bar
    if (rem === 0 && (fullBars > 0 && fullBars < 3)) fullBars--;

    return { fullBars, rem };
  }, [sizeDomain]);

  /**
   * Creates a vertical line capped by a bordered tick
   * @param x     Distance in pixels from the left edge of the size bar
   * @param color Tick color (line & border are always white)
   * @param index Bar index, used to determine vertical position; should be fullBars or fullSelectBars
   * @param uniqueId Unique identifier for the elements
   * @returns SVG elements for the line and tick
   */
  const lineAndTick: (x: number, color: string, index: number) => JSX.Element = useCallback((x, color, index) => (
    <>
      {/* White border for selection tick */}
      <polygon
        points={
              `${x},${1} ` +
              `${x - 7},${-6} ` +
              `${x + 7},${-6}`
            }
        fill="white"
        transform={translate(0, (index * OFFSET) / 2)}
      />
      {/* Selection tick */}
      <polygon
        points={
              `${x},${0} ` +
              `${x - 5},${-5} ` +
              `${x + 5},${-5}`
            }
        fill={color}
        transform={translate(0, (index * OFFSET) / 2)}
      />
      {/* Vertical white line */}
      <line
        stroke="white"
        strokeWidth="1px"
        x1={x}
        x2={x}
            // y1 is the top of the selection bar, y2 is the bottom of the row
        y1={(index * OFFSET) / 2}
        y2={dimensions.size.plotHeight}
      />
    </>
  ), [dimensions.size.plotHeight, OFFSET]);

  /*
   * Hooks
   */

  // Compute vars for size bars
  const scale = useScale(
    [0, sizeDomain],
    [0, dimensions.attribute.width],
  );

  const { fullBars, rem } = useMemo(() => calculateBars(size), [size, calculateBars]);
  const { fullBars: fullSelectBars, rem: remSelect } = useMemo(() => calculateBars(selected), [selected, calculateBars]);

  // X-coord for the end of the selected bar
  const selectedWidth = useMemo(() => {
    let result = scale(remSelect);
    if (selected > 0 && result === 0) result = dimensions.attribute.width;
    return result;
  }, [remSelect, selected, dimensions.attribute.width, scale]);
  // X-coord for the end of the size bar
  const sizeWidth = useMemo(() => {
    let result = scale(rem);
    if (size > 0 && result === 0) result = dimensions.attribute.width;
    return result;
  }, [rem, size, dimensions.attribute.width, scale]);

  // Calculate all rectangles for the size bar
  const rectArray = useMemo(() => {
    const result: Rect[] = [];
    for (let i = 0; i < 3; ++i) {
      // Full bars, which may be the selection color if the selection size is greater than the full bar size
      if (i < fullBars) {
        result.push({
          transform: translate(0, (i * OFFSET) / 2),
          height: dimensions.size.plotHeight - i * OFFSET,
          width: dimensions.attribute.width,
          fillColor: i < fullSelectBars ? darkenColor(i, elementSelectionColor) : getFillColor(i),
          opacity: i < fullSelectBars ? SELECTION_OPACITY : 1,
          key: `$fullbar-${i}`,
        });
      } else if (i === fullBars) { // Partial standard bar
        result.push({
          transform: translate(0, (fullBars * OFFSET) / 2),
          height: dimensions.size.plotHeight - fullBars * OFFSET,
          width: sizeWidth,
          fillColor: getFillColor(fullBars),
          opacity: 1,
          key: 'partial-std',
        });
      }
      // Partial element selection bar
      if (i === fullSelectBars) {
        result.push({
          transform: translate(0, (fullSelectBars * OFFSET) / 2),
          height: dimensions.size.plotHeight - fullSelectBars * OFFSET,
          width: selectedWidth,
          fillColor: darkenColor(fullSelectBars, elementSelectionColor),
          opacity: SELECTION_OPACITY,
          key: 'partial-select',
        });
      }
    }
    return result;
  }, [
    fullBars, OFFSET, dimensions.size.plotHeight, dimensions.attribute.width, fullSelectBars,
    elementSelectionColor, getFillColor, SELECTION_OPACITY, translate, sizeWidth, selectedWidth,
  ]);

  /*
   * Render
   */

  if (size < 0 || sizeDomain < 0) return null;
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
          fillOpacity={rect.opacity}
          // Key simply needs to be unique for each rect
          key={rect.key}
        />
      ))}
      {/* Tick & line at end of element selection bar */}
      {fullSelectBars < 3 && selected > 0 &&
        lineAndTick(selectedWidth, elementSelectionColor, fullSelectBars)}
      {/* Tick & line at end of size bar */}
      {fullBars < 3
        && (
          (currentIntersection && currentIntersection?.id === row?.id)
          || (row && bookmarks.some((bookmark) => bookmark.id === row.id))
        )
        && lineAndTick(
          sizeWidth,
          (row && bookmarks.some((bookmark) => bookmark.id === row.id)) ? bookmarkedColorPallete[row.id] : nextColor,
          fullBars,
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
      {showText && (
        <text
          textAnchor="start"
          dominantBaseline="middle"
          transform={translate(
            (fullBars > 0 ? dimensions.attribute.width : sizeWidth) + 5,
            dimensions.body.rowHeight / 2,
          )}
        >
          {size}
        </text>
      )}
    </g>
  );
};
