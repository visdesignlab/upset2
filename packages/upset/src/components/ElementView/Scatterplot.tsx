import { Scatterplot } from '@visdesignlab/upset2-core';
import { FC, useMemo } from 'react';

import { createAddScatterplotSpec } from './generatePlotSpec';
import { VegaLiteChart, VegaNamedData } from '../VegaLiteChart';

type Props = {
  spec: Scatterplot;
  data: VegaNamedData;
};

export const ScatterplotPlot: FC<Props> = ({ spec, data }) => {
  const chartSpec = useMemo(
    () =>
      createAddScatterplotSpec(
        {
          attribute: spec.x,
          logScale: spec.xScaleLog || false,
        },
        {
          attribute: spec.y,
          logScale: spec.yScaleLog || false,
        },
      ),
    [spec.x, spec.y, spec.xScaleLog, spec.yScaleLog],
  );

  return <VegaLiteChart spec={chartSpec} data={data} actions={false} />;
};
