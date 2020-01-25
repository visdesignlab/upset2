import React, { FC } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { ScaleLinear } from 'd3';
import { observer, inject } from 'mobx-react';
import translate from '../../../ComponentUtils/Translate';

interface DotPlotProps {
  store?: UpsetStore;
  height: number;
  width: number;
  values: number[];
  scale: ScaleLinear<number, number>;
}

const DotPlot: FC<DotPlotProps> = ({ height, width, values, scale }: DotPlotProps) => {
  const radius = 2;
  const reducedHeight = height * 0.5;

  const getJitter = () => {
    return Math.random() * reducedHeight;
  };

  return (
    <g transform={translate(0, (height - reducedHeight) / 2)}>
      {values.map((val, idx) => (
        <circle
          fill="#77DD77"
          key={idx}
          r={radius}
          opacity={0.8}
          cx={scale(val)}
          cy={getJitter()}
        ></circle>
      ))}
    </g>
  );
};

export default inject('store')(observer(DotPlot));
