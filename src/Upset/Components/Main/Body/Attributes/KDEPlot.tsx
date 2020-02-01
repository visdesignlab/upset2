import React, { FC, useMemo } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { ScaleLinear, mean, scaleLinear, line, curveBasis, extent } from 'd3';
import { observer, inject } from 'mobx-react';
import translate from '../../../ComponentUtils/Translate';

interface KDEPlotProps {
  store?: UpsetStore;
  height: number;
  width: number;
  values: number[];
  scale: ScaleLinear<number, number>;
}

const KDEPlot: FC<KDEPlotProps> = ({ height, width, values, scale }: KDEPlotProps) => {
  const reducedHeight = height * 0.5;

  const x = scale;

  const y = scaleLinear()
    .domain([0, 10])
    .range([0, reducedHeight])
    .nice();

  const density = kde(epanechnikov(7), x.ticks(), values);

  const lineD = line()
    .curve(curveBasis)
    .x(d => x(d[0]))
    .y(d => y(d[1]));

  const d = lineD(density as any) || '';

  return (
    <g transform={translate(0, (height - reducedHeight) / 2)}>
      <path d={d} stroke="black" strokeWidth="1" />
    </g>
  );
};

export default inject('store')(observer(KDEPlot));

function kde(kernel: any, thresholds: any[], data: any[]) {
  return thresholds.map(t => [t, mean(data, d => kernel(t - d))]);
}

function epanechnikov(bandwidth: any) {
  return (x: any) => (Math.abs((x /= bandwidth)) <= 1 ? (0.75 * (1 - x * x)) / bandwidth : 0);
}
