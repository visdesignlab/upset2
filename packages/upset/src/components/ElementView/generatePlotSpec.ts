import {
  Histogram, isHistogram, isScatterplot, Plot, Scatterplot,
} from '@visdesignlab/upset2-core';
import { VisualizationSpec } from 'react-vega';
import { SelectionParameter } from 'vega-lite/build/src/selection';

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
  height: number = 400,
  width: number = 400,
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
export function generateScatterplotSpec(
  spec: Scatterplot,
  selectColor: string,
): VisualizationSpec {
  return {
    width: 200,
    height: 200,
    signals: [
      { name: 'brush', value: {} },
    ],
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
        type: 'quantitative',
        scale: { zero: false, type: spec.xScaleLog ? 'log' : 'linear' },
      },
      y: {
        field: spec.y,
        type: 'quantitative',
        scale: { zero: false, type: spec.yScaleLog ? 'log' : 'linear' },
      },
      color: {
        condition: {
          param: 'brush',
          empty: false,
          value: selectColor,
        },
        field: 'subset',
        legend: null,
        scale: { range: { field: 'color' } },
      },
      opacity: {
        condition: [
          {
            param: 'brush',
            empty: false,
            value: 0.8,
          },
          {
            test: {
              or: [
                { not: { param: 'brush' } },
                'datum["isCurrentSelected"] === true && datum["isCurrent"] === false',
              ],
            },
            value: 0.3,
          },
        ],
        value: 0.8,
      },
      order: {
        condition: {
          test: 'datum["isCurrentSelected"] === true && datum["isCurrent"] === true',
          value: 1,
        },
        value: 0,
      },
    },
  };
}

/**
 * Creates the spec for a single histogram, used in the "Add Plot" dialog.
 * @param attribute The attribute to plot.
 * @param bins      The number of bins to use.
 * @param frequency Whether to plot frequency or density; true for frequency.
 * @returns The Vega-Lite spec for the histogram.
 */
export function createAddHistogramSpec(
  attribute: string,
  bins: number,
  frequency: boolean,
): VisualizationSpec {
  if (frequency) {
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
 * @returns An array of Vega-Lite specs for the histograms.
 */
export function generateHistogramSpec(
  hist: Histogram,
  // selection: NumericalQuery | undefined,
)
: VisualizationSpec {
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

  const COLOR = {
    field: 'subset',
    legend: null,
    scale: { range: { field: 'color' } },
  };

  if (hist.frequency) {
    return {
      width: 200,
      height: 200,
      layer: [
        { // This layer displays the overall probability lines for selected/bookmarked intersections
          transform: [
            {
              density: hist.attribute,
              groupby: ['subset', 'color'],
            },
            { // Hacky way to get the correct name for the attribute & sync with other plots
              // Otherwise, the attribute name is "value", so selections don't sync and the signal sent
              // by selecting on this plot doesn''t include the name of the attribute being selected
              calculate: 'datum["value"]',
              as: hist.attribute,
            },
          ],
          params,
          mark: 'line',
          encoding: {
            x: { field: hist.attribute, type: 'quantitative', title: hist.attribute },
            y: { field: 'density', type: 'quantitative', title: 'Probability' },
            color: COLOR,
            opacity: { value: 0.4 },
          },
        },
        { // This layer displays probability lines for selected elements, grouped by subset
          transform: [
            {
              density: hist.attribute,
              groupby: ['subset', 'color'],
            },
            {
              filter: { param: 'brush' },
            },
            {
              calculate: 'datum["value"]',
              as: hist.attribute,
            },
          ],
          mark: 'line',
          encoding: {
            x: { field: hist.attribute, type: 'quantitative', title: hist.attribute },
            y: { field: 'density', type: 'quantitative' },
            color: COLOR,
            opacity: { value: 1 },
          },
        },
      ],
    };
  }

  return {
    width: 200,
    height: 200,
    signals: [
      { name: 'brush', value: {} },
    ],
    layer: [
      {
        params,
        mark: 'bar',
        encoding: {
          x: {
            bin: { maxbins: hist.bins },
            field: hist.attribute,
          },
          y: {
            aggregate: 'count',
            title: 'Frequency',
          },
          color: COLOR,
          opacity: { value: 0.4 },
        },
      }, {
        transform: [{
          filter: { param: 'brush' },
        }],
        mark: 'bar',
        encoding: {
          x: {
            field: hist.attribute,
            bin: { maxbins: hist.bins },
          },
          y: {
            aggregate: 'count',
            title: 'Frequency',
          },
          color: COLOR,
          opacity: { value: 1 },
        },
      },
    ],
  };
}

/**
 * Generates a vega spec for a plot.
 * @param plot The plot to generate a spec for
 * @param selectColor The color to use for selected points
 * @returns The vega spec for the plot
 */
export function generateVegaSpec(plot: Plot, selectColor: string): VisualizationSpec {
  const BASE = {
    data: { name: 'elements' },
  };

  if (isScatterplot(plot)) {
    return { ...BASE, ...generateScatterplotSpec(plot, selectColor) } as VisualizationSpec;
  }
  if (isHistogram(plot)) {
    return { ...BASE, ...generateHistogramSpec(plot) } as VisualizationSpec;
  }
  throw new Error('Invalid plot type');
}
