import React, { FC, useMemo, useEffect, useContext } from 'react';
import { inject, observer } from 'mobx-react';
import { UpsetStore } from '../../../Store/UpsetStore';
import { scaleLinear, axisBottom, axisTop, select } from 'd3';
import { ProvenanceContext } from '../../../Upset';

export interface DeviationHeaderProps {
  store?: UpsetStore;
  height: number;
  width: number;
  deviationLimit: number;
}

const DeviationHeader: FC<DeviationHeaderProps> = ({
  height,
  width,
  deviationLimit
}: DeviationHeaderProps) => {
  const headerBarHeight = 30;
  const scaleHeight = 30;
  const padding = 5;
  const totalHeight = scaleHeight + padding + headerBarHeight + padding;

  const { actions } = useContext(ProvenanceContext);

  const scale = useMemo(() => {
    return scaleLinear()
      .domain([-deviationLimit * 100, deviationLimit * 100])
      .range([0, width])
      .nice();
  }, [width, deviationLimit]);

  useEffect(() => {
    const tickCount = 8;
    const top = axisBottom(scale)
      .ticks(tickCount)
      .tickFormat((d, i) => (i % 1 === 0 ? d.toString() : ''));
    const bottom = axisTop(scale)
      .ticks(tickCount)
      .tickFormat(_ => '');

    select('.deviation-scale')
      .select('.scale-top')
      .call(top as any);
    select('.deviation-scale')
      .select('.scale-bottom')
      .call(bottom as any);
  }, [scale]);

  return (
    <g transform={`translate(0, ${height - totalHeight})`}>
      <g cursor="s-resize" onClick={() => actions.setSortBy('Deviation')}>
        <rect height={headerBarHeight} width={width} fill="#ccc" stroke="black" strokeWidth={0.3} />
        <text
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="1.3em"
          transform={`translate(${width / 2}, ${headerBarHeight / 2})`}
        >
          Deviation
        </text>
      </g>
      <g className="deviation-scale" transform={`translate(0, ${headerBarHeight + padding})`}>
        <g className="scale-top"></g>
        <g className="scale-bottom" transform={`translate(0, ${scaleHeight})`}></g>
      </g>
    </g>
  );
};

export default inject('store')(observer(DeviationHeader));
