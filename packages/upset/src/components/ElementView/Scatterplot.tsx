import { Scatterplot } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { PlainObject, VegaLite } from 'react-vega';

import { createScatterplotSpec } from './generatePlotSpec';

type Props = {
  spec: Scatterplot;
  data: PlainObject;
};

export const ScatterplotPlot: FC<Props> = ({ spec, data }) => {
  return (
    <VegaLite
      spec={createScatterplotSpec(
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
};
