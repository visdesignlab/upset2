import { css } from '@emotion/react';

export const highlight = css`
  fill: #fed9a6;
  stroke: #feca82;
  stroke-width: 2;
  stroke-opacity: 0.8;
  fill-opacity: 1;
`;

export const columnHighlight = css`
  fill: #fed9a6;
  fill-opacity: 0.7;
`;

export const hoverHighlight = css`
  fill: #fed9a6;
  fill-opacity: 0.7;
`;

// transparent default
export const defaultBackground = css`
  fill-opacity: 0;
`;

/** Colors for selected & bookmarked intersections */
export const queryColorPalette = [
  '#2ca02c',
  '#9467bd',
  '#d62728',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

/**
 * Colors for stacked categorical bar charts
 * This is a rough rainbow, scrambled to provide more contrast
 */
export const categoryColorPalette = [
  '#FFBD42',
  '#F50F63',
  '#B91830',
  '#7A5095',
  '#003F5C',
  '#21837F',
  '#73D2DE',
];

/** 2 colors to alternate when the category total overflows the categoryColorPalette */
export const extraCategoryColors = ['#555', '#bbb'];

/** Color to use for selected & bookmarked intersections when the query color palette runs out */
export const extraQueryColor = '#000';

/** Color for the active vega selections (orange) */
export const vegaSelectionColor = '#ff7f0e';

/** Color for the active query selections (blue) */
export const querySelectionColor = '#1f77b4';

export const mousePointer = css`
  cursor: pointer;
`;

export const arrowIconCSS = {
  height: '16px',
  width: '16px',
  marginLeft: '6px',
};

// Stroke color and width for queryBySets Interface and query rows
export const ROW_BORDER_STROKE_COLOR = '#555555';
export const ROW_BORDER_STROKE_WIDTH = '1px';

// Default background color for attribute plots
export const ATTRIBUTE_DEFAULT_COLOR = '#d3d3d3';

// Default background color for aggregate and query rows
export const DEFAULT_ROW_BACKGROUND_COLOR = '#cccccc';
export const DEFAULT_ROW_BACKGROUND_OPACITY = '0.3';

/** Color for unselected elements in the element view */
export const DEFAULT_ELEMENT_COLOR = '#444';
