import React, { FC, useMemo, useEffect } from 'react';
import { UpsetStore } from '../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { scaleLinear, axisBottom, axisTop, select } from 'd3';

interface Props {
  store?: UpsetStore;
  height: number;
  width: number;
  globalDomainLimit: number;
}

const SurpriseCardinalityHeader: FC<Props> = ({ height, width, globalDomainLimit }: Props) => {
  const headerBarHeight = 30;
  const scaleHeight = 30;
  const padding = 5;
  const totalHeight = scaleHeight + padding + headerBarHeight + padding;

  const scale = useMemo(() => {
    return scaleLinear()
      .domain([0, globalDomainLimit])
      .range([0, width])
      .nice();
  }, [width, globalDomainLimit]);

  useEffect(() => {
    const tickCount = 20;
    const top = axisBottom(scale)
      .ticks(tickCount)
      .tickFormat((d, i) => (i % 4 === 0 ? d.toString() : ''));
    const bottom = axisTop(scale)
      .ticks(tickCount)
      .tickFormat(_ => '');

    select('.scale-top').call(top as any);
    select('.scale-bottom').call(bottom as any);
  }, [scale]);

  return (
    <g transform={`translate(0, ${height - totalHeight})`}>
      <g cursor="pointer">
        <rect height={headerBarHeight} width={width} fill="#ccc" stroke="black" strokeWidth={0.3} />
        <text
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="1.3em"
          transform={`translate(${width / 2}, ${headerBarHeight / 2})`}
        >
          Surprise Cardinality
        </text>
      </g>
      <g className="scale" transform={`translate(0, ${headerBarHeight + padding})`}>
        <g className="scale-top"></g>
        <g className="scale-bottom" transform={`translate(0, ${scaleHeight})`}></g>
      </g>
    </g>
  );
};

export default inject('store')(observer(SurpriseCardinalityHeader));
