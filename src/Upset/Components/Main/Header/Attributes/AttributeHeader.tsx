import React, { FC, useMemo, useEffect, useContext } from 'react';
import { UpsetStore } from '../../../../Store/UpsetStore';
import { inject, observer } from 'mobx-react';
import { scaleLinear, axisBottom, axisTop, select } from 'd3';
import translate from '../../../ComponentUtils/Translate';
import { style } from 'typestyle';
import { AttributeVisualizationTypeMap } from '../../Body/Attributes/AttributeRow';
import { ProvenanceContext } from '../../../../Upset';

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
  minScale,
  maxScale,
  store
}: AttributeHeaderProps) => {
  const { visibleAttributes } = store!;

  const typeButtonsHeight = 30;
  const headerBarHeight = 30;
  const scaleHeight = 30;
  const padding = 5;
  const totalHeight =
    typeButtonsHeight + padding + scaleHeight + padding + headerBarHeight + padding;

  const scale = useMemo(() => {
    return scaleLinear()
      .domain([minScale, maxScale])
      .range([0, width])
      .nice();
  }, [width, minScale, maxScale]);

  const className = headerClassName(name);

  const { actions } = useContext(ProvenanceContext);

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

  const typesList = Object.keys(AttributeVisualizationTypeMap);
  const typesCount = typesList.length;
  const typesPaddingCount = typesCount - 1;
  const typeButtonWidth = (width - padding * typesPaddingCount) / typesCount;

  return (
    <g transform={translate(0, height - totalHeight)}>
      <g>
        {typesList.map((type, idx) => (
          <g
            transform={translate((typeButtonWidth + padding) * idx, 0)}
            key={type}
            onClick={() => {
              actions.setAttributeType(name, AttributeVisualizationTypeMap[type]);
            }}
          >
            <rect
              className={type === visibleAttributes[name] ? selected : ''}
              height={typeButtonsHeight}
              width={typeButtonWidth}
              fill="gray"
              stroke="black"
              strokeWidth="1px"
              opacity={0.5}
            />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              transform={translate(typeButtonWidth / 2, typeButtonsHeight / 2)}
            >
              {type}
            </text>
          </g>
        ))}
      </g>
      <g cursor="s-resize" transform={translate(0, typeButtonsHeight + padding)}>
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
      <g
        className={className}
        transform={`translate(0, ${typeButtonsHeight + padding + headerBarHeight + padding})`}
      >
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

const selected = style({
  fill: 'black'
});
