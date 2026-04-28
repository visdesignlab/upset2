import { Scatterplot } from '@visdesignlab/upset2-core';
import { createAddScatterplotSpec } from './generatePlotSpec';
import { VegaLiteChart, VegaNamedData } from '../VegaLiteChart';

type Props = {
  spec: Scatterplot;
  data: VegaNamedData;
};

export function ScatterplotPlot({ spec, data }: Props) {
  return (
    <VegaLiteChart
      spec={createAddScatterplotSpec(
        {
          attribute: spec.x,
          logScale: spec.xScaleLog || false,
        },
        {
          attribute: spec.y,
          logScale: spec.yScaleLog || false,
        },
      )}
      data={data}
      actions={false}
    />
  );
}
