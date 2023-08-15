import { css } from '@emotion/react';
import { FC } from 'react';
import translate from '../../utils/transform';

/** @jsxImportSource @emotion/react */
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
}

export const TickLine: FC<Props> = ({
  type, value, fontSize, tickLength, tickFontHeight, hideLine,
}) => {
  switch (type) {
    case 'bottom':
      return (
        <>
          <text
            dominantBaseline="middle"
            fill="none"
            fontSize={`${fontSize}rem`}
            stroke="white"
            strokeLinejoin="round"
            strokeWidth="4"
            textAnchor="end"
            transform={translate(0, tickLength + tickFontHeight / 1.5)}
          >
            {value}
          </text>
          { !hideLine &&
            <line stroke="currentColor" y2={tickLength} />}
          <text
            css={css`
                ${shadow}
              `}
            dominantBaseline="middle"
            fontSize={`${fontSize}rem`}
            textAnchor="middle"
            transform={translate(0, tickLength + tickFontHeight / 1.5)}
          >
            {value}
          </text>
        </>
      );
    case 'left':
      return (
        <>
          <text
            dominantBaseline="middle"
            fill="none"
            fontSize={`${fontSize}rem`}
            stroke="white"
            strokeLinejoin="round"
            strokeWidth="4"
            textAnchor="end"
            transform={translate(-10, 0)}
          >
            {value}
          </text>
          { !hideLine &&
            <line
              stroke="currentColor"
              transform={translate(-tickLength, 0)}
              x1={tickLength}
            />}
          <text
            css={css`
                ${shadow}
              `}
            dominantBaseline="middle"
            fontSize={`${fontSize}rem`}
            textAnchor="end"
            transform={translate(-10, 0)}
          >
            {value}
          </text>
        </>
      );
    case 'top':
      return (
        <>
          <text
            dominantBaseline="middle"
            fill="none"
            fontSize={`${fontSize}rem`}
            stroke="white"
            strokeLinejoin="round"
            strokeWidth="4"
            textAnchor="end"
            transform={translate(0, -(tickLength + tickFontHeight / 1.5))}
          >
            {value}
          </text>
          { !hideLine &&
            <line
              stroke="currentColor"
              transform={translate(0, -tickLength)}
              y2={tickLength}
            />}
          <text
            css={css`
                ${shadow}
              `}
            dominantBaseline="middle"
            fontSize={`${fontSize}rem`}
            textAnchor="middle"
            transform={translate(0, -(tickLength + tickFontHeight / 1.5))}
          >
            {value}
          </text>
        </>
      );
    case 'right':
      return (
        <>
          <text
            dominantBaseline="middle"
            fill="none"
            fontSize={`${fontSize}rem`}
            stroke="white"
            strokeLinejoin="round"
            strokeWidth="4"
            textAnchor="end"
            transform={translate(10, 0)}
          >
            {value}
          </text>
          { !hideLine &&
            <line stroke="currentColor" x1={tickLength} />}
          <text
            css={css`
                ${shadow}
              `}
            dominantBaseline="middle"
            fontSize={`${fontSize}rem`}
            textAnchor="start"
            transform={translate(10, 0)}
          >
            {value}
          </text>
        </>
      );
    default:
      return null;
  }
};
