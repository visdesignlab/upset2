import { ScaleLinear } from 'd3-scale';
import React, { useMemo } from 'react';

import translate from '../../utils/transform';
import { TickLine, AxisType } from './AxisTickLine';

type Props = {
  scale: ScaleLinear<number, number>;
  transform?: string;
  type: AxisType;
  label: string | Element;
  margin: number;
  pixelsPerTick?: number;
  showLabel?: boolean;
  fontSize?: number;
  tickFormatter?: (value: number) => string | number;
  hideLine?: boolean;
};

const defaultTickFormatter = (d: number) => {
  if (d >= 1000000) return `${d.toString()[0]}e${d.toString().length - 1}`;

  if (d >= 500000) return `${(d as number) / 100000}M`;

  if (d >= 1000) return `${(d as number) / 1000}K`;

  return d;
};

export const Axis = ({
  transform = '',
  label,
  type,
  scale,
  margin,
  fontSize = 1,
  pixelsPerTick = 50,
  showLabel = true,
  hideLine = false,
  tickFormatter = defaultTickFormatter,
}: Props) => {
  const tickLength = 6;
  const tickFontHeight = fontSize * 14 * 1.2;
  const labelFontSize = 15;

  const { ticks, extent } = useMemo(() => {
    const range = scale.range();

    const width = Math.abs(range[1] - range[0]);

    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));

    return {
      ticks: scale.ticks(numberOfTicksTarget).map((value) => ({
        value,
        formattedValue: tickFormatter(value),
        offset: scale(value),
      })),
      extent: width,
    };
  }, [scale, tickFormatter, pixelsPerTick]);

  const labelTransform = (axisType: AxisType) => {
    switch (axisType) {
      case 'bottom':
        return translate(Math.max(...scale.range()) / 2, margin - 3);
      case 'top':
        return translate(Math.max(...scale.range()) / 2, -(margin - 3));
      case 'left':
        return `${translate(
          -(margin - 3),
          Math.max(...scale.range()) / 2,
        )}rotate(270)`;
      case 'right':
        return `${translate(
          margin - 3,
          Math.max(...scale.range()) / 2,
        )}rotate(90)`;
      default:
        return translate(0, 0);
    }
  };

  const labelAnchor = (axisType: AxisType) => {
    switch (axisType) {
      case 'bottom':
        return 'auto';
      case 'left':
        return 'hanging';
      case 'top':
        return 'hanging';
      case 'right':
        return 'hanging';
      default:
        return 'auto';
    }
  };

  const path = (axisType: AxisType) => {
    switch (axisType) {
      case 'bottom':
        return `M 0 ${tickLength} v -${tickLength} H ${extent} v ${tickLength}`;
      case 'left':
        return `M -${tickLength} 0 h ${tickLength} V ${extent} h -${tickLength}`;
      case 'top':
        return `M 0 -${tickLength} v ${tickLength} H ${extent} v -${tickLength}`;
      case 'right':
        return `M ${tickLength} 0 h -${tickLength} V ${extent} h ${tickLength}`;
      default:
        return '';
    }
  };

  const tickTransform = (axisType: AxisType, offset: number) => {
    switch (axisType) {
      case 'bottom':
        return translate(offset, 0);
      case 'left':
        return translate(0, offset);
      case 'top':
        return translate(offset, 0);
      case 'right':
        return translate(0, offset);
      default:
        return translate(0, 0);
    }
  };

  return (
    <g transform={transform}>
      {!hideLine && <path d={path(type)} fill="none" stroke="currentColor" />}
      {ticks.map(({ formattedValue, value, offset }) => (
        <g key={value} transform={tickTransform(type, offset)}>
          <TickLine
            type={type}
            value={formattedValue}
            fontSize={fontSize}
            tickLength={tickLength}
            tickFontHeight={tickFontHeight}
            hideLine={hideLine}
          />
        </g>
      ))}
      {/* Axis Label */}
      {showLabel && (
        <text
          dominantBaseline={labelAnchor(type)}
          fontSize={labelFontSize}
          textAnchor="middle"
          transform={labelTransform(type)}
        >
          {label}
        </text>
      )}
    </g>
  );
};
