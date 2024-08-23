import {
  NumericalQuery, Histogram, isHistogram, isScatterplot, Plot, Scatterplot,
} from '@visdesignlab/upset2-core';
import { VisualizationSpec } from 'react-vega';

/**
 * Converts an NumericalQuery to a value for a vega param.
 * Plots want x and y ranges instead of attribute ranges, so we need to convert the selection to match.
 * If this plot's axis don't match the selection attributes, we return undefined to avoid conflicting selections.
 * @param plot   The plot that we need a selection value for
 * @param select The element selection to use to generate the selection value
 * @returns An object which can be assigned to the 'value' field of a vega param in the plot
 *          to display the selection in the plot.
 */
function convertSelection(plot: Plot, select: NumericalQuery): NumericalQuery | undefined {
  let val: NumericalQuery | undefined;
  if (isScatterplot(plot) && select[plot.x] && select[plot.y]) {
    val = {
      x: select[plot.x],
      y: select[plot.y],
    };
  } else if (isHistogram(plot) && Object.keys(select).length === 1 && select[plot.attribute]) {
    val = {
      x: select[plot.attribute],
    };
  } else val = undefined;
  return val;
}

/**
 * Creates the spec for a single scatterplot.
 * @param x - The attribute to plot on the x-axis.
 * @param y - The attribute to plot on the y-axis.
 * @param height - The height of the plot.
 * @param width - The width of the plot.
 * @returns The Vega-Lite spec for the scatterplot.
 */
export function createScatterplotSpec(
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
 * Creates the spec for multiple scatterplots containing data from multiple subsets.
 * @param specs       Scatterplot objects with x and y attributes.
 * @param selection   The current brush selection, if extant
 * @param selectColor The color to use for brushed points
 * @returns The Vega-Lite spec for the scatterplots.
 */
export function createScatterplotRow(
  specs: Scatterplot[],
  selection: NumericalQuery | undefined,
  selectColor: string,
): VisualizationSpec[] {
  return specs.map((s) => ({
    width: 200,
    height: 200,
    mark: {
      type: 'point',
    },
    // We only add the 'params' field if this object has a selection OR if there is no selection
    // This works around a Vega bug where providing the value field to a param doesn't always work in concatenated plots
    ...((!selection || (selection && convertSelection(s, selection))) && {
      params: [
        {
          name: 'brush',
          select: {
            type: 'interval',
            clear: 'mousedown',
          },
          // We only add the 'value' field if selection is defined
          ...(selection && convertSelection(s, selection) && { value: convertSelection(s, selection) }),
        },
      ],
    }),
    encoding: {
      x: {
        field: s.x,
        type: 'quantitative',
        scale: { zero: false, type: s.xScaleLog ? 'log' : 'linear' },
      },
      y: {
        field: s.y,
        type: 'quantitative',
        scale: { zero: false, type: s.yScaleLog ? 'log' : 'linear' },
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
  }));
}

/**
 * Creates the spec for a single histogram.
 * @param attribute The attribute to plot.
 * @param bins      The number of bins to use.
 * @param frequency Whether to plot frequency or density; true for frequency.
 * @returns The Vega-Lite spec for the histogram.
 */
export function createHistogramSpec(
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
 * Creates the spec for multiple histograms containing data from multiple subsets.
 * Currently used by the element view pane
 * @param histograms The histograms to plot.
 * @param selection  Current brush selection
 * @returns An array of Vega-Lite specs for the histograms.
 */
export function createHistogramRow(
  histograms: Histogram[],
  selection: NumericalQuery | undefined,
)
: VisualizationSpec[] {
  function makeParams(plot: Histogram) {
    return [
      {
        name: 'brush',
        select: {
          type: 'interval',
          encodings: ['x'],
          clear: 'mousedown',
        },
        ...(selection && convertSelection(plot, selection) && { value: convertSelection(plot, selection) }),
      },
    ];
  }

  const COLOR = {
    field: 'subset',
    legend: null,
    scale: { range: { field: 'color' } },
  };

  // eslint-disable-next-line arrow-body-style
  return histograms.filter((h) => !h.frequency).map((h) => {
    /* Due to a vega-lite bug, we can't use the density transform in a concatenated plot
     * To re-enable this, remove the filter statement above this comment, uncomment the following block,
     * and uncomment the frequency control in AddPlot.tsx
    if (h.frequency) {
      return {
        width: 200,
        height: 200,
        layer: [
          { // This layer displays the overall probability lines for selected/bookmarked intersections
            transform: [
              {
                density: h.attribute,
                groupby: ['subset', 'color'],
              },
              { // Hacky way to get the correct name for the attribute & sync with other plots
                // Otherwise, the attribute name is "value", so selections don't sync and the signal sent
                // by selecting on this plot doesn''t include the name of the attribute being selected
                calculate: 'datum["value"]',
                as: h.attribute,
              },
            ],
            params: makeParams(h),
            mark: 'line',
            encoding: {
              x: { field: h.attribute, type: 'quantitative', title: h.attribute },
              y: { field: 'density', type: 'quantitative', title: 'Probability' },
              color: COLOR,
              opacity: { value: 0.4 },
            },
          },
          { // This layer displays probability lines for selected elements, grouped by subset
            transform: [
              {
                density: h.attribute,
                groupby: ['subset', 'color'],
              },
              {
                filter: { param: 'brush' },
              },
              {
                calculate: 'datum["value"]',
                as: h.attribute,
              },
            ],
            mark: 'line',
            encoding: {
              x: { field: h.attribute, type: 'quantitative', title: h.attribute },
              y: { field: 'density', type: 'quantitative' },
              color: COLOR,
              opacity: { value: 1 },
            },
          },
        ],
      };
    }
    */

    return {
      width: 200,
      height: 200,
      layer: [
        {
          params: makeParams(h),
          mark: 'bar',
          encoding: {
            x: {
              bin: { maxBins: h.bins },
              field: h.attribute,
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
              field: h.attribute,
              bin: { maxBins: h.bins },
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
  });
}

export function generateVega(
  scatterplots: Scatterplot[],
  histograms: Histogram[],
  selectColor: string,
  selection? : NumericalQuery,
): VisualizationSpec {
  // If we have an empty selection {}, we need to feed undefined to the specs, but !!{} is true
  const newSelection = selection && Object.keys(selection).length > 0 ? selection : undefined;
  const scatterplotSpecs = createScatterplotRow(scatterplots, newSelection, selectColor);
  const histogramSpecs = createHistogramRow(histograms, newSelection);
  const base = {
    data: {
      name: 'elements',
    },
    hconcat: [
      {
        vconcat: scatterplotSpecs,
      },
      {
        vconcat: histogramSpecs,
      },
    ],
  };

  return base as VisualizationSpec;
}
