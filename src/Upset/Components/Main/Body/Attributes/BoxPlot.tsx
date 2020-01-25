import React, { FC } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { Stats } from '../../../../Interfaces/UpsetDatasStructure/Attribute';
import { ScaleLinear } from 'd3';
import { inject, observer } from 'mobx-react';
import translate from '../../../ComponentUtils/Translate';
import { Popup, Statistic, Card } from 'semantic-ui-react';

interface BoxPlotProps {
  store?: UpsetStore;
  name: string;
  height: number;
  width: number;
  values: number[];
  stats: Stats;
  scale: ScaleLinear<number, number>;
}

const BoxPlot: FC<BoxPlotProps> = ({ height, name, width, values, stats, scale }: BoxPlotProps) => {
  const reducedHeight = height * 0.7;
  const {
    median,
    mean,
    quantile: { first, third },
    min,
    max
  } = stats;

  const lowerWhisker = (
    <g>
      <line x1={scale(min)} x2={scale(min)} y1={0} y2={reducedHeight} stroke="black" />
      <line
        x1={scale(min)}
        x2={scale(first)}
        y1={reducedHeight / 2}
        y2={reducedHeight / 2}
        stroke="black"
      />
    </g>
  );

  const upperWhisker = (
    <g>
      <line x1={scale(max)} x2={scale(max)} y1={0} y2={reducedHeight} stroke="black" />
      <line
        x1={scale(third)}
        x2={scale(max)}
        y1={reducedHeight / 2}
        y2={reducedHeight / 2}
        stroke="black"
      />
    </g>
  );

  const medianLine = (
    <line x1={scale(median)} x2={scale(median)} y1={0} y2={reducedHeight} stroke="black" />
  );

  const IQRRect = (
    <rect
      x={scale(first)}
      y={0}
      width={scale(third) - scale(first)}
      height={reducedHeight}
      fill="gray"
      stroke="black"
      strokeWidth="0.1"
      opacity={0.7}
    />
  );

  return (
    <g transform={translate(0, (height - reducedHeight) / 2)}>
      <Popup
        flowing
        trigger={IQRRect}
        content={
          <StatsView
            name={name}
            mean={mean}
            median={median}
            min={min}
            max={max}
            q1={first}
            q3={third}
          />
        }
      ></Popup>
      {medianLine}
      {lowerWhisker}
      {upperWhisker}
    </g>
  );
};

export default inject('store')(observer(BoxPlot));

interface StatsViewProps {
  mean: number;
  median: number;
  min: number;
  max: number;
  q1: number;
  q3: number;
  name: string;
}

const StatsView: FC<StatsViewProps> = ({
  name,
  mean,
  median,
  min,
  max,
  q1,
  q3
}: StatsViewProps) => {
  const minStat = (
    <Statistic>
      <Statistic.Value>{roundTo2(min)}</Statistic.Value>
      <Statistic.Label>Min</Statistic.Label>
    </Statistic>
  );

  const q1Stat = (
    <Statistic>
      <Statistic.Value>{roundTo2(q1)}</Statistic.Value>
      <Statistic.Label>Q1</Statistic.Label>
    </Statistic>
  );

  const medianStat = (
    <Statistic>
      <Statistic.Value>{roundTo2(median)}</Statistic.Value>
      <Statistic.Label>Median</Statistic.Label>
    </Statistic>
  );

  const meanStat = (
    <Statistic>
      <Statistic.Value>{roundTo2(mean)}</Statistic.Value>
      <Statistic.Label>Mean</Statistic.Label>
    </Statistic>
  );

  const q3Stat = (
    <Statistic>
      <Statistic.Value>{roundTo2(q3)}</Statistic.Value>
      <Statistic.Label>Q3</Statistic.Label>
    </Statistic>
  );

  const maxStat = (
    <Statistic>
      <Statistic.Value>{roundTo2(max)}</Statistic.Value>
      <Statistic.Label>Max</Statistic.Label>
    </Statistic>
  );

  return (
    <Card fluid>
      <Card.Content textAlign="center">
        <Card.Header>{name}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Statistic.Group size="tiny">
          {minStat}
          {q1Stat}
          {medianStat}
          {meanStat}
          {q3Stat}
          {maxStat}
        </Statistic.Group>
      </Card.Content>
    </Card>
  );
};

function roundTo2(num: number) {
  return num.toFixed(2).replace('.00', '');
}
