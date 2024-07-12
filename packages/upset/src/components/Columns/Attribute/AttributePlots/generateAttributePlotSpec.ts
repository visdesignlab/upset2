import { AttributePlotType } from '@visdesignlab/upset2-core';
import { VisualizationSpec } from 'react-vega';

/**
 * Generate the vega-lite specification for an attribute plot.
 * @param {AttributePlotType} plotType - The type of plot to generate. Currently only density plots are supported.
 * @param {number[]} values - The data points to plot.
 * @param {number} min - The minimum value for the attribute range.
 * @param {number} max - The maximum value for the attribute range.
 * @param {stirng} plotColor - The fill color to use for the plot.
 * @returns {VisualizationSpec | null} The vega-lite specification for the attribute plot.
 */
export function generateAttributePlotSpec(
  plotType: AttributePlotType,
  values: number[],
  min: number,
  max: number,
  plotColor: string,
): VisualizationSpec | null {
  // for every value provided, add it to an object with the key: density
  // this will be used to generate the density plot
  const data = {
    values: values.map((value: any) => ({ density: value })),
  };

  if (plotType === AttributePlotType.DensityPlot) {
    return {
      height: 'container',
      autosize: 'fit',
      padding: 0,
      background: 'transparent',
      config: {
        style: {
          cell: {
            stroke: 'transparent',
          },
        },
      },
      data: {
        values: data.values,
      },
      mark: 'area',
      transform: [
        {
          density: 'density', extent: [min, max],
        },
      ],
      encoding: {
        x: {
          field: 'value', type: 'quantitative', axis: null,
        },
        y: {
          field: 'density', type: 'quantitative', axis: null,
        },
        color: {
          value: plotColor,
        },
      },
    };
  }

  return null;
}
