import { css } from '@emotion/react';
import { FC, useMemo } from 'react';
import translate from '../../utils/transform';

const shadow = css`
  textshadow: 0 0 5px white;
`;

export type AxisType = 'left' | 'right' | 'top' | 'bottom';

type Props = {
  type: AxisType;
  value: string | number;
  fontSize: number;
  tickLength: number;
  tickFontHeight: number;
  hideLine: boolean;
};

/**
 * The tick line on an attribute scale axis, with a label on top of the line.
 */
export const TickLine: FC<Props> = ({
  type,
  value,
  fontSize,
  tickLength,
  tickFontHeight,
  hideLine,
}) => {
  const textTransform = useMemo(() => {
    switch (type) {
      case 'bottom':
        return translate(0, tickLength + tickFontHeight / 1.5);
      case 'left':
        return translate(-10, 0);
      case 'top':
        return translate(0, -(tickLength + tickFontHeight / 1.5));
      case 'right':
        return translate(10, 0);
      default:
        return undefined;
    }
  }, [type, tickLength, tickFontHeight]);

  const lineTransform = useMemo(() => {
    switch (type) {
      case 'bottom':
        return undefined;
      case 'left':
        return translate(-tickLength, 0);
      case 'top':
        return translate(0, -tickLength);
      case 'right':
        return undefined;
      default:
        return undefined;
    }
  }, [type, tickLength]);

  const textAnchor = useMemo(() => {
    switch (type) {
      case 'bottom':
        return 'middle';
      case 'left':
        return 'end';
      case 'top':
        return 'middle';
      case 'right':
        return 'start';
      default:
        return undefined;
    }
  }, [type]);

  return (
    <>
      {!hideLine && (
        <line
          stroke="currentColor"
          y2={type === 'bottom' || type === 'top' ? tickLength : undefined}
          x1={type === 'left' || type === 'right' ? tickLength : undefined}
          transform={lineTransform}
        />
      )}
      <text
        css={css`
          ${shadow}
        `}
        dominantBaseline="middle"
        fontSize={`${fontSize}rem`}
        textAnchor={textAnchor}
        transform={textTransform}
      >
        {value}
      </text>
    </>
  );
};
