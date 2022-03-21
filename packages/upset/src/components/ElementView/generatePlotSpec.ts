import { Histogram, Scatterplot } from '@visdesignlab/upset2-core';
import { VisualizationSpec } from 'react-vega';

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

export function createScatterplotRow(specs: Scatterplot[]) {
  return specs.map((s) => ({
    width: 200,
    height: 200,
    mark: {
      type: 'point',
    },
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
        condition: {
          test: 'datum["isCurrentSelected"] === true && datum["isCurrent"] === false',
          value: '#000',
        },
      },
      opacity: {
        condition: [
          {
            test: 'datum["isCurrentSelected"] === true && datum["isCurrent"] === false',
            value: 0.05,
          },
          {
            test: 'datum["isCurrentSelected"] === true && datum["isCurrent"] === true',
            value: 0.8,
          },
        ],
        value: 0.4,
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
        bin: true,
        field: attribute,
      },
      y: { aggregate: 'count' },
    },
  };

  return base;
}

export function createHistogramRow(histograms: Histogram[]) {
  return histograms.map(({ attribute, bins, frequency }) => {
    if (frequency) {
      return {
        width: 200,
        height: 200,
        transform: [
          {
            density: attribute,
            groupby: ['subset', 'color'],
          },
        ],
        params: [
          {
            name: 'grid',
            select: 'interval',
            bind: 'scales',
          },
        ],
        mark: 'line',
        encoding: {
          x: { field: 'value', type: 'quantitative', title: attribute },
          y: { field: 'density', type: 'quantitative', title: 'probabiity' },
          color: {
            field: 'subset',
            legend: null,
            scale: { range: { field: 'color' } },
          },
        },
      };
    }

    return {
      width: 200,
      height: 200,
      mark: {
        type: 'bar',
      },
      encoding: {
        x: {
          bin: { maxBins: bins },
          field: attribute,
        },
        y: {
          aggregate: 'count',
          title: 'Frequency',
        },
        color: {
          field: 'subset',
          legend: null,
          scale: { range: { field: 'color' } },
        },
      },
    };
  });
}

export function generateVega(
  scatterplots: Scatterplot[],
  histograms: Histogram[],
) {
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

  return base;
}

export function createWordCloudSpec(): VisualizationSpec {
  return {
    width: 400,
    height: 400,
    data: {
      name: 'elements',
    },
    mark: 'text',
    transform: [
      {
        type: 'wordcloud',
        size: [800, 400],
        text: { field: 'label' },
        rotate: { random: [-60, -30, 0, 30, 60] },
        font: 'Helvetica Neue, Arial',
        fontSize: { field: 'datum.count' },
        fontWeight: { field: 'datum.weight' },
        fontSizeRange: [12, 56],
        padding: 2,
      } as any,
    ],
  };
}
