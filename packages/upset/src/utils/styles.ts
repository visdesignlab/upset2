import { css } from '@emotion/react';

/** @jsxImportSource @emotion/react */
export const highlight = css`
  fill: #fed9a6;
  stroke: #feca82;
  stroke-width: 2;
  stroke-opacity: 0.8;
  fill-opacity: 1.0;
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
  fill-opacity: 0.0;
`;

/** Colors for selected & bookmarked intersections */
export const queryColorPalette = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf',
];

/** Color for the active element selections: 'Rich Amber' */
export const elementSelectionColor = '#e49b0f';

export const mousePointer = css`
  cursor: pointer;
`;

export const arrowIconCSS = {
  height: '16px', width: '16px', marginLeft: '6px',
};

export const ATTRIBUTE_DEFAULT_COLOR = '#d3d3d3';
