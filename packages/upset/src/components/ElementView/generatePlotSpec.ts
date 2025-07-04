import {
  Histogram,
  isHistogram,
  isScatterplot,
  Plot,
  Scatterplot,
  SelectionType,
} from '@visdesignlab/upset2-core';
import { VisualizationSpec } from 'react-vega';
import { SelectionParameter } from 'vega-lite/build/src/selection';
import { Predicate } from 'vega-lite/build/src/predicate';
import { LogicalComposition } from 'vega-lite/build/src/logical';
import { AnyMark } from 'vega-lite/build/src/mark';
import { Aggregate } from 'vega-lite/build/src/aggregate';
import { StandardType } from 'vega-lite/build/src/type';
import { DEFAULT_ELEMENT_COLOR, vegaSelectionColor } from '../../utils/styles';

/**
 * Janky gadget which can be inserted into a condition and returns TRUE if the brush param is empty
 * @private The left-side predicate evaluates to true if the brush is empty OR the item is in the brush;
 *          the right-side predicate evaluates to true if the item is selected OR the brush is empty.
 *          This creates a logical gadget that evaluates to true if the brush is empty regardless of the item state.
 */
const BRUSH_EMPTY: LogicalComposition<Predicate> = {
  and: [{ not: { param: 'brush', empty: false } }, { param: 'brush' }],
};

/**
 * Creates the spec for a single scatterplot.
 * Used in the "Add Plot" dialog.
 * @param x - The attribute to plot on the x-axis.
 * @param y - The attribute to plot on the y-axis.
 * @param height - The height of the plot.
 * @param width - The width of the plot.
 * @returns The Vega-Lite spec for the scatterplot.
 */
export function createAddScatterplotSpec(
  x: {
    attribute: string;
    logScale: boolean;
  },
  y: {
    attribute: string;
    logScale: boolean;
  },
  height = 400,
  width = 400,
): VisualizationSpec {
  return {
    width,
    height,
    data: {
      name: 'elements',
    },
    mark: {
      type: 'point',
      opacity: 0.5,
    },
    encoding: {
      x: {
        field: x.attribute,
        type: 'quantitative',
        scale: { zero: false, type: x.logScale ? 'log' : 'linear' },
      },
      y: {
        field: y.attribute,
        type: 'quantitative',
        scale: { zero: false, type: y.logScale ? 'log' : 'linear' },
      },
    },
  };
}

/**
 * Creates the spec for a single scatterplot in the element view matrix.
 * @param specs       Scatterplot objects with x and y attributes.
 * @param selectColor The color to use for brushed points
 * @returns The Vega-Lite spec for the scatterplots.
 */
export function generateScatterplotSpec(spec: Scatterplot): VisualizationSpec {
  return {
    width: 200,
    height: 200,
    signals: [{ name: 'brush', value: {} }],
    mark: {
      type: 'point',
    },
    params: [
      {
        name: 'brush',
        select: {
          type: 'interval',
          clear: 'mousedown',
        },
      },
    ],
    encoding: {
      x: {
        field: spec.x,
        title: spec.x,
        type: 'quantitative',
        scale: { zero: false, type: spec.xScaleLog ? 'log' : 'linear' },
      },
      y: {
        field: spec.y,
        title: spec.y,
        type: 'quantitative',
        scale: { zero: false, type: spec.yScaleLog ? 'log' : 'linear' },
      },
      color: {
        condition: [
          {
            test: {
              and: [
                { param: 'brush', empty: false },
                {
                  not: {
                    and: [
                      { field: 'selectionType', equal: 'row' },
                      { field: 'isCurrent', equal: true },
                    ],
                  },
                },
              ],
            },
            value: vegaSelectionColor,
          },
        ],
        field: 'subset',
        legend: null,
        scale: { range: { field: 'color' } },
      },
      opacity: {
        condition: [
          {
            test: {
              and: [
                {
                  param: 'brush',
                  empty: false,
                },
                { field: 'selectionType', equal: 'vega' },
              ],
            },
            value: 0.8,
          },
          {
            test: {
              and: [
                { or: [BRUSH_EMPTY, { not: { field: 'selectionType', equal: 'vega' } }] },
                {
                  or: [
                    { field: 'isCurrentSelected', equal: false },
                    { field: 'isCurrent', equal: true },
                  ],
                },
              ],
            },
            value: 0.8,
          },
        ],
        value: 0.3,
      },
      order: {
        condition: [
          {
            test: {
              and: [
                { param: 'brush', empty: false },
                { field: 'selectionType', equal: 'vega' },
              ],
            },
            value: 3,
          },
          {
            test: {
              and: [
                { field: 'isCurrent', equal: true },
                { field: 'selectionType', equal: 'row' },
              ],
            },
            value: 4,
          },
          {
            test: {
              and: [
                { field: 'isCurrentSelected', equal: true },
                { field: 'isCurrent', equal: true },
              ],
            },
            value: 2,
          },
          {
            test: { field: 'bookmarked', equal: true },
            value: 1,
          },
        ],
        value: 0,
      },
    },
  };
}

/**
 * Creates the spec for a single histogram, used in the "Add Plot" dialog.
 * @param attribute The attribute to plot.
 * @param bins      The number of bins to use.
 * @param density Whether to plot frequency or density; true for frequency.
 * @returns The Vega-Lite spec for the histogram.
 */
export function createAddHistogramSpec(
  attribute: string,
  bins: number,
  density: boolean,
): VisualizationSpec {
  if (density) {
    const base: VisualizationSpec = {
      width: 400,
      height: 400,
      data: {
        name: 'elements',
      },
      transform: [
        {
          density: attribute,
        },
      ],
      mark: 'line',
      encoding: {
        x: { field: 'value', type: 'quantitative' },
        y: { field: 'density', type: 'quantitative' },
      },
    };

    return base;
  }

  const base: VisualizationSpec = {
    width: 400,
    height: 400,
    data: {
      name: 'elements',
    },
    mark: 'bar',
    encoding: {
      x: {
        bin: { maxbins: bins },
        field: attribute,
      },
      y: { aggregate: 'count' },
    },
  };

  return base;
}

/**
 * Creates the spec for a single histogram in the element view matrix.
 * @param histograms The histograms to plot.
 * @param selectionType The currently active selection type, from the currentSelectionType selector
 * @param haveSelection Whether a vega selection exists
 * @returns An array of Vega-Lite specs for the histograms.
 */
export function generateHistogramSpec(
  hist: Histogram,
  selectionType: SelectionType,
  haveSelection: boolean,
): VisualizationSpec {
  const params = [
    {
      name: 'brush',
      select: {
        type: 'interval' as const,
        encodings: ['x'],
        clear: 'mousedown',
      },
    },
  ] as SelectionParameter[];

  /** Color for layers showing all elements (not selection layers) */
  const COLOR = {
    field: 'subset',
    legend: null,
    scale: { range: { field: 'color' } },
  };

  /** Opacity for layers showing all elements (not selection layers) */
  const OPACITY = {
    condition: { test: BRUSH_EMPTY, value: 1 },
    value: 0.4,
  };

  /** Whether the selection type is 'row' */
  const selectionTypeRow = selectionType === 'row';

  if (hist.frequency) {
    // KDE plot
    return {
      width: 200,
      height: 200,
      signals: [{ name: 'brush', value: {} }],
      layer: [
        {
          // This layer shows all elements in grey
          transform: [
            { density: hist.attribute },
            {
              // Hacky way to get the correct name for the attribute & sync with other plots
              // Otherwise, the attribute name is "value", so selections don't sync and the signal sent
              // by selecting on this plot doesn't include the name of the attribute being selected
              calculate: 'datum["value"]',
              as: hist.attribute,
            },
          ],
          mark: 'line',
          encoding: {
            x: {
              field: hist.attribute,
              type: 'quantitative',
              title: hist.attribute,
            },
            y: { field: 'density', type: 'quantitative', title: 'Probability' },
            color: { value: DEFAULT_ELEMENT_COLOR },
            opacity: selectionTypeRow ? { value: 0.4 } : OPACITY,
          },
        },
        {
          // This layer displays probability density for all elements, grouped by subset
          params,
          transform: [
            { filter: { field: 'bookmarked', equal: true } },
            { density: hist.attribute, groupby: ['subset', 'color'] },
            { calculate: 'datum["value"]', as: hist.attribute },
          ],
          mark: 'line',
          encoding: {
            x: {
              field: hist.attribute,
              type: 'quantitative',
              title: hist.attribute,
            },
            y: { field: 'density', type: 'quantitative', title: 'Probability' },
            color: COLOR,
            opacity: selectionTypeRow ? { value: 0.4 } : OPACITY,
          },
        },
        {
          // This layer displays probability density for selected elements
          transform: [
            { filter: { param: 'brush', empty: false } },
            { density: hist.attribute },
            { calculate: 'datum["value"]', as: hist.attribute },
          ],
          mark: 'line',
          encoding: {
            x: {
              field: hist.attribute,
              type: 'quantitative',
              title: hist.attribute,
            },
            y: { field: 'density', type: 'quantitative' },
            color: { value: vegaSelectionColor },
            opacity: { value: selectionTypeRow ? 0.4 : 1 },
          },
        }, // This layer displays probability density for the selected intersection
        ...(selectionTypeRow
          ? [
              {
                transform: [
                  { filter: { field: 'isCurrent', equal: true } },
                  { density: hist.attribute, groupby: ['subset', 'color'] },
                  { calculate: 'datum["value"]', as: hist.attribute },
                ],
                mark: 'line' as AnyMark, // Vega is weird about some types in destructured objects
                encoding: {
                  // More vega weirdness
                  x: {
                    field: hist.attribute,
                    type: 'quantitative' as StandardType,
                    title: hist.attribute,
                  },
                  y: { field: 'density', type: 'quantitative' as StandardType },
                  color: COLOR,
                  opacity: { value: 1 },
                },
              },
            ]
          : []),
      ],
    };
  }

  return {
    width: 200,
    height: 200,
    signals: [{ name: 'brush', value: {} }],
    layer: [
      {
        params,
        mark: 'bar',
        encoding: {
          x: { bin: { maxbins: hist.bins }, field: hist.attribute },
          y: { aggregate: 'count', title: 'Frequency' },
          color: COLOR,
          opacity: OPACITY,
        },
      },
      {
        transform: [
          {
            filter: { param: 'brush', empty: false },
          },
        ],
        mark: 'bar',
        encoding: {
          x: {
            field: hist.attribute,
            bin: { maxbins: hist.bins },
            title: hist.attribute,
          },
          y: { aggregate: 'count', title: 'Frequency' },
          color: { value: vegaSelectionColor },
          opacity: { value: 1 },
        },
      },
      ...(selectionTypeRow && haveSelection
        ? [
            {
              transform: [{ filter: { field: 'isCurrent', equal: true } }],
              mark: 'bar' as AnyMark, // Vega is weird about some types in destructured objects
              encoding: {
                x: { field: hist.attribute, bin: { maxbins: hist.bins } },
                y: { aggregate: 'count' as Aggregate, title: 'Frequency' },
                color: COLOR,
                opacity: { value: 1 },
              },
            },
          ]
        : []),
    ],
  };
}

/**
 * Generates a vega spec for a plot.
 * @param plot The plot to generate a spec for
 * @param selectionType The currently active selection type, from the currentSelectionType selector
 * @param haveSelection Whether a vega selection exists
 * @returns The vega spec for the plot
 */
export function generateVegaSpec(
  plot: Plot,
  selectionType: SelectionType,
  haveSelection: boolean,
): VisualizationSpec {
  const BASE = {
    data: { name: 'elements' },
  };

  if (isScatterplot(plot)) {
    return { ...BASE, ...generateScatterplotSpec(plot) } as VisualizationSpec;
  }
  if (isHistogram(plot)) {
    return {
      ...BASE,
      ...generateHistogramSpec(plot, selectionType, haveSelection),
    } as VisualizationSpec;
  }
  throw new Error('Invalid plot type');
}
