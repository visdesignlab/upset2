import React, { FC, useEffect, useState, useMemo, useContext } from 'react';
import { UpsetStore } from '../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { scaleLinear, select, axisTop, axisBottom, drag, event } from 'd3';
import { style } from 'typestyle';
import { CardinalityContext } from '../../../Upset';

interface Props {
  store?: UpsetStore;
  height: number;
  width: number;
  globalDomainLimit: number;
}

const CardinalityHeader: FC<Props> = ({ width, height, globalDomainLimit }: Props) => {
  const topScaleHeight = 30;
  const headerBarHeight = 30;
  const bottomScaleHeight = 30;
  const padding = 5;
  const totalHeight =
    topScaleHeight + padding + headerBarHeight + padding + bottomScaleHeight + padding;

  const { notifyCardinalityChange, localCardinalityLimit } = useContext(CardinalityContext);

  function updateLocalDomainLimit(newLimit: number) {
    notifyCardinalityChange(newLimit);
  }

  const [isChanging, setIsChanging] = useState(false);

  const topScale = useMemo(() => {
    const topScale = scaleLinear()
      .domain([0, globalDomainLimit])
      .range([0, width])
      .nice();

    return topScale;
  }, [width, globalDomainLimit]);

  useEffect(() => {
    const tickCount = 20;

    const top = axisBottom(topScale)
      .ticks(tickCount)
      .tickFormat((d, i) => (i % 4 === 0 ? d.toString() : ''));
    const bottom = axisTop(topScale)
      .ticks(tickCount)
      .tickFormat(_ => '');

    select('.top-scale-top').call(top as any);
    select('.top-scale-bottom').call(bottom as any);
  }, [topScale]);

  const bottomScale = useMemo(() => {
    const bottomScale = scaleLinear()
      .domain([0, localCardinalityLimit])
      .range([0, width])
      .nice();
    return bottomScale;
  }, [width, localCardinalityLimit]);

  useEffect(() => {
    const tickCount = 20;

    const top = axisBottom(bottomScale)
      .ticks(tickCount)
      .tickFormat((d, i) => (i % 4 === 0 ? d.toString() : ''));
    const bottom = axisTop(bottomScale)
      .ticks(tickCount)
      .tickFormat(_ => '');

    select('.bottom-scale-top').call(top as any);
    select('.bottom-scale-bottom').call(bottom as any);
  }, [bottomScale]);

  useEffect(() => {
    (select('.rect-handle') as any).call(
      drag()
        .on('start', () => {
          setIsChanging(true);
        })
        .on('drag', () => {
          const newX = event.x;
          if (newX > 0 && newX <= width) {
            updateLocalDomainLimit(topScale.invert(newX));
          }
        })
        .on('end', () => {
          setIsChanging(false);
          const newX = event.x;
          if (newX > 0 && newX <= width) {
            notifyCardinalityChange(topScale.invert(newX));
          }
        })
    );
  });

  return (
    <g transform={`translate(0, ${height - totalHeight})`}>
      <g>
        <rect
          className="top-scale-indicator-rect"
          height={topScaleHeight}
          width={topScale(localCardinalityLimit)}
          fill="#ccc"
          opacity={0.4}
        ></rect>
        <g className="top-scale-top"></g>
        <g transform={`translate(0, ${topScaleHeight})`} className="top-scale-bottom"></g>
        <g
          transform={`translate(${topScale(localCardinalityLimit)}, ${topScaleHeight / 2 -
            Math.tan(45) * 5})`}
          className="rect-handle"
        >
          <rect
            transform={`rotate(45)`}
            height={10}
            width={10}
            fill="#666"
            opacity="0.5"
            stroke="black"
            strokeWidth="0.4"
            cursor="ew-resize"
          ></rect>
        </g>
      </g>
      <g cursor="pointer" transform={`translate(0,${padding + topScaleHeight})`}>
        <g className={`${headerBlock} ${isChanging ? hide : ''}`}>
          <rect
            fill="#ccc"
            stroke="black"
            strokeWidth={0.3}
            width={width}
            height={headerBarHeight}
          ></rect>
          <text
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="1.3em"
            transform={`translate(${width / 2}, ${headerBarHeight / 2})`}
          >
            Cardinality
          </text>
        </g>
        <g className={`${triangleBlock} ${isChanging ? '' : hide}`}>
          <path
            d={`M 0 0 H ${topScale(
              localCardinalityLimit
            )} L ${width} ${headerBarHeight} h -${width} V 0`}
          ></path>
        </g>
      </g>
      <g transform={`translate(0,${topScaleHeight + padding + headerBarHeight + padding})`}>
        <g className="bottom-scale-top"></g>
        <g transform={`translate(0, ${bottomScaleHeight})`} className="bottom-scale-bottom"></g>
      </g>
    </g>
  );
};

export default inject('store')(observer(CardinalityHeader));

const hide = style({
  opacity: '0 !important',
  transition: 'opacity 1s'
});

const triangleBlock = style({
  opacity: 0.5,
  fill: '#ccc',
  transition: 'opacity 1s'
});

const headerBlock = style({
  opacity: 1,
  transition: 'opacity 1s'
});
