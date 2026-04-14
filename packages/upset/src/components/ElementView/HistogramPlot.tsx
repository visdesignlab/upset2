import { Histogram } from '@visdesignlab/upset2-core';
import { FC, useMemo } from 'react';

import { createAddHistogramSpec } from './generatePlotSpec';
import { VegaLiteChart, VegaNamedData } from '../VegaLiteChart';

type Props = {
  spec: Histogram;
  data: VegaNamedData;
};

export const HistogramPlot: FC<Props> = ({ spec, data }) => {
  const chartSpec = useMemo(
    () => createAddHistogramSpec(spec.attribute, spec.bins, spec.frequency),
    [spec.attribute, spec.bins, spec.frequency],
  );

  return <VegaLiteChart spec={chartSpec} data={data} actions={false} />;
};
