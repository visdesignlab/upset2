import React, { FC, useMemo } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { ScaleLinear } from 'd3';
import translate from '../../../ComponentUtils/Translate';
import { pure } from 'recompose';

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

  const valuesString = JSON.stringify(values);

  const randomYPositions = useMemo(() => {
    const values = JSON.parse(valuesString) as number[];

    return values.map(() => getJitter(reducedHeight));
  }, [valuesString, reducedHeight]);

  return (
    <g transform={translate(0, (height - reducedHeight) / 2)}>
      {values.map((val, idx) => (
        <circle
          fill="#77DD77"
          key={idx}
          r={radius}
          opacity={0.8}
          cx={scale(val)}
          cy={randomYPositions[idx]}
        ></circle>
      ))}
    </g>
  );
};

export default pure(DotPlot);

function getJitter(max: number) {
  return Math.random() * max;
}
