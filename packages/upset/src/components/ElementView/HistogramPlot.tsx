import { Histogram } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { PlainObject, VegaLite } from 'react-vega';

import { createAddHistogramSpec } from './generatePlotSpec';

type Props = {
  spec: Histogram;
  data: PlainObject;
};

export const HistogramPlot: FC<Props> = ({ spec, data }) => (
  <VegaLite
    spec={createAddHistogramSpec(spec.attribute, spec.bins, spec.frequency)}
    data={data}
    actions={false}
  />
);
