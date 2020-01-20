import React, { FC, useMemo, useEffect } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { scaleLinear, axisBottom, axisTop, select } from 'd3';
import translate from '../../../ComponentUtils/Translate';
import { style } from 'typestyle';

export interface AttributeHeaderProps {
  store?: UpsetStore;
  name: string;
  height: number;
  width: number;
  zeroScale?: boolean;
  minScale: number;
  maxScale: number;
}

const AttributeHeader: FC<AttributeHeaderProps> = ({
  name,
  height,
  width,
  zeroScale,
  minScale,
  maxScale
}: AttributeHeaderProps) => {
  const headerBarHeight = 30;
  const scaleHeight = 30;
  const padding = 5;
  const totalHeight = scaleHeight + padding + headerBarHeight + padding;

  const scale = useMemo(() => {
    return scaleLinear()
      .domain([zeroScale ? 0 : minScale, maxScale])
      .range([0, width])
      .nice();
  }, [width, zeroScale, minScale, maxScale]);

  const className = headerClassName(name);

  useEffect(() => {
    const tickCount = 8;
    const top = axisBottom(scale)
      .ticks(tickCount)
      .tickFormat((d, i) => (i % 2 === 0 ? d.toString() : ''));
    const bottom = axisTop(scale)
      .ticks(tickCount)
      .tickFormat(_ => '');

    const curr = select(`.${className}`);
    curr.select('.scale-top').call(top as any);
    curr.select('.scale-bottom').call(bottom as any);
  });

  return (
    <g transform={translate(0, height - totalHeight)}>
      <g cursor="s-resize">
        <rect height={headerBarHeight} width={width} fill="#ccc" stroke="black" strokeWidth={0.3} />
        <text
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="1.3em"
          transform={`translate(${width / 2}, ${headerBarHeight / 2})`}
        >
          {name}
        </text>
      </g>
      <g className={className} transform={`translate(0, ${headerBarHeight + padding})`}>
        <g className="scale-top"></g>
        <g className="scale-bottom" transform={`translate(0, ${scaleHeight})`}></g>
      </g>
    </g>
  );
};

export default inject('store')(observer(AttributeHeader));

const headerClassName = (name: string) => {
  let fixedName = name.replace(/\s/g, '');
  return `${fixedName}${style({})}`;
};
