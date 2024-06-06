import { Histogram, Scatterplot } from '@visdesignlab/upset2-core';
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
 * Creates the spec for multiple scatterplots containing data from multiple subsets.
= * @param specs - scatterplot objects with x and y attributes.
 * @returns The Vega-Lite spec for the histogram.
 */
export function createScatterplotRow(specs: Scatterplot[]): VisualizationSpec[] {
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
 * @param attribute - The attribute to plot.
 * @param bins - The number of bins to use.
 * @param frequency - Whether to plot frequency or density; true for frequency.
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
 * @returns An array of Vega-Lite specs for the histograms.
 */
export function createHistogramRow(histograms: Histogram[]): VisualizationSpec[] {
  const PARAMS = [
    {
      name: 'brush',
      select: {
        type: 'interval',
        encodings: ['x'],
        clear: 'mousedown',
      },
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
): VisualizationSpec {
  const scatterplotSpecs = createScatterplotRow(scatterplots);
  const histogramSpecs = createHistogramRow(histograms);
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
