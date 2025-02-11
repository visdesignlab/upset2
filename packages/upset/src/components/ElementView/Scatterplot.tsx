import { Scatterplot } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { PlainObject, VegaLite } from 'react-vega';

import { createAddScatterplotSpec } from './generatePlotSpec';

type Props = {
  spec: Scatterplot;
  data: PlainObject;
};

export const ScatterplotPlot: FC<Props> = ({ spec, data }) => (
  <VegaLite
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
