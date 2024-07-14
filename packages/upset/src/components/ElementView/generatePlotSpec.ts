import { ElementSelection, Histogram, Scatterplot } from '@visdesignlab/upset2-core';
import { VisualizationSpec } from 'react-vega';

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
 * Converts an ElementSelection from a different Vega plot to the format necessary to display correctly on this plot.
 * The scatterplot wants selections defined as x and y ranges and doesn't accept axis names instead,
 * so we convert the axis names to x and y ranges.
 * @param plot   The scatterplot that we need a selection value for
 * @param select The element selection to use to generate the selection value
 * @returns An object which can be assigned to the 'value' field of a vega param in scatterplot s
 *          to display the selection represented by e
 */
function convertSelection(plot: Scatterplot, select: ElementSelection): ElementSelection | undefined {
  let val: ElementSelection | undefined;
  if (select[plot.x] && select[plot.y]) {
    val = {
      x: select[plot.x],
      y: select[plot.y],
    }
  } else if (select[plot.x]) {
    val = {
      x: select[plot.x],
      y: [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
    }
  } else if (select[plot.y]) {
    val = {
      y: select[plot.y],
      x: [-Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
    }
  } else val = undefined;
  return val;
}

/**
 * Creates the spec for multiple scatterplots containing data from multiple subsets.
 * @param specs       Scatterplot objects with x and y attributes.
 * @param selection   The current brush selection, if extant
 * @param selectColor The color to use for brushed points
 * @returns The Vega-Lite spec for the scatterplots.
 */
export function createScatterplotRow(specs: Scatterplot[], selection: ElementSelection | undefined, selectColor: string): VisualizationSpec[] {
  return specs.map((s) => ({
    width: 200,
    height: 200,
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
        // We only add the 'value' field if selection is defined
        ...(selection && {value: convertSelection(s, selection)}),
      },
    ],
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
        condition:{
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
            test: {or: [
              {not: {param: 'brush'}},
              'datum["isCurrentSelected"] === true && datum["isCurrent"] === false'
            ]},
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
export function createHistogramRow(histograms: Histogram[], selection: ElementSelection | undefined): VisualizationSpec[] {
  const PARAMS = [
    {
      name: 'brush',
      select: {
        type: 'interval',
        encodings: ['x'],
        clear: 'mousedown',
      },
      ...(selection && {value: selection}),
    }
  ];

  const COLOR = {
    field: 'subset',
    legend: null,
    scale: { range: { field: 'color' } },
  };

  return histograms.map(({ attribute, bins, frequency }) => {
    if (frequency) {
      return {
        width: 200,
        height: 200,
        layer: [
          {
            transform: [
              {
                density: attribute,
                groupby: ['subset', 'color'],
              },
              {// Hacky way to get the correct name for the attribute & sync with other plots
              // Otherwise, the attribute name is "value", so selections don't sync and the signal doesn't 
              // include the name of the attribute being selected
                calculate: 'datum["value"]',
                as: attribute,
              },
            ],
            params: PARAMS,
            mark: 'line',
            encoding: {
              x: { field: attribute, type: 'quantitative', title: attribute },
              y: { field: 'density', type: 'quantitative', title: 'probabiity' },
              color: COLOR,
              opacity: {
                condition: [
                  {
                    param: 'brush',
                    empty: false,
                    value: 1,
                  },
                  {
                    test: {or: [
                      {not: {param: 'brush'}},
                      'datum["isCurrentSelected"] === true && datum["isCurrent"] === false'
                    ]},
                    value: .4,
                  },
                ],
                value: .4
              },
            },
          },
          {
            transform: [
              {
                filter: {param: 'brush'}
              },
              {
                density: attribute,
                groupby: ['subset', 'color'],
              },
              {
                calculate: 'datum["value"]',
                as: attribute,
              },
            ],
            mark: 'line',
            encoding: {
              x: { field: attribute, type: 'quantitative', title: attribute },
              y: { field: 'density', type: 'quantitative', title: 'probabiity' },
              color: COLOR,
              opacity: {value: 1},
            },
          }
        ]
      };
    }

    return {
      width: 200,
      height: 200,
      layer: [
        {
          params: PARAMS,
          mark: "bar",
          encoding: {
            x: {
              bin: { maxBins: bins },
              field: attribute,
            },
            y: {
              aggregate: 'count',
              title: 'Frequency',
            },
            color: COLOR,
            opacity: {value: .4},
          },
        },{
          transform: [{
            filter: {param: 'brush'}
          }],
          mark: "bar",
          encoding: {
            x: {
              field: attribute,
              bin: {maxBins: bins}
            },
            y: {
              aggregate: 'count',
              title: 'Frequency',
            },
            color: COLOR,
            opacity: {value: 1},
          }
        }
      ],
    };
  });
}

export function generateVega(
  scatterplots: Scatterplot[],
  histograms: Histogram[],
  selectColor: string,
  selection? : ElementSelection
): VisualizationSpec {
  // If we have an empty selection {}, we need to feed undefined to the specs, but !!{} is true
  const newSelection = selection && Object.keys(selection).length > 0 ? selection : undefined;
  const scatterplotSpecs = createScatterplotRow(scatterplots, newSelection, selectColor);
  const histogramSpecs = createHistogramRow(histograms, newSelection);
  const base = {
    data: {
      name: 'elements',
    },
    vconcat: [
      {
        hconcat: scatterplotSpecs,
      },
      {
        hconcat: histogramSpecs,
      },
    ],
  };

  return base as VisualizationSpec;
}
