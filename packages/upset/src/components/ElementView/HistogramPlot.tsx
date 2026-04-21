import { Histogram } from '@visdesignlab/upset2-core';
import { createAddHistogramSpec } from './generatePlotSpec';
import { VegaLiteChart, VegaNamedData } from '../VegaLiteChart';

type Props = {
  spec: Histogram;
  data: VegaNamedData;
};

export function HistogramPlot({ spec, data }: Props) {
  return (
    <VegaLiteChart
      spec={createAddHistogramSpec(spec.attribute, spec.bins, spec.frequency)}
      data={data}
      actions={false}
    />
  );
}
