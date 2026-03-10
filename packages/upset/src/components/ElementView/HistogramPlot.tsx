import { Histogram } from '@visdesignlab/upset2-core';
import { FC } from 'react';

import { createAddHistogramSpec } from './generatePlotSpec';
import { VegaLiteChart, VegaNamedData } from '../VegaLiteChart';

type Props = {
  spec: Histogram;
  data: VegaNamedData;
};

export const HistogramPlot: FC<Props> = ({ spec, data }) => (
  <VegaLiteChart
    spec={createAddHistogramSpec(spec.attribute, spec.bins, spec.frequency)}
    data={data}
    actions={false}
  />
);
