import { FiveNumberSummary } from '@visdesignlab/upset2-core';
import { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { attributeMinMaxSelector } from '../atoms/attributeAtom';
import { dimensionsSelector } from '../atoms/dimensionsAtom';
import { useScale } from '../hooks/useScale';
import translate from '../utils/transform';

type Props = {
  attribute: string;
  summary: FiveNumberSummary;
};

const Tick: FC<{ x1: number; x2: number; y1?: number; y2?: number }> = ({
  x1,
  x2,
  y1 = -5,
  y2 = 5,
}) => (
  <line // Min Tick
    opacity="0.4"
    x1={x1}
    x2={x2}
    strokeWidth="2px"
    y1={y1}
    y2={y2}
    stroke="black"
  />
);

// this is recomputing every hover event?
export const AttributeBar: FC<Props> = ({ attribute, summary }) => {
  const dimensions = useRecoilValue(dimensionsSelector);
  const { min, max } = useRecoilValue(attributeMinMaxSelector(attribute));
  const scale = useScale([min, max], [0, dimensions.attribute.width]);

  if (summary.max === undefined || summary.min === undefined || summary.first === undefined || summary.third === undefined || summary.median === undefined) {
    return null;
  }

  return (
    <g transform={translate(0, dimensions.attribute.plotHeight / 2)}>
      <Tick // Min Tick
        x1={scale(summary.min)}
        x2={scale(summary.min)}
      />
      <line
        opacity="0.4"
        x1={scale(summary.min)}
        x2={scale(summary.first)}
        strokeWidth="2px"
        y1={0}
        y2={0}
        stroke="black"
        strokeDasharray="4"
      />
      <rect
        x={scale(summary.first)}
        y={-(dimensions.attribute.plotHeight - 4) / 2}
        width={scale(summary.third) - scale(summary.first)}
        height={dimensions.attribute.plotHeight - 4}
        stroke="black"
        strokeWidth="2px"
        strokeOpacity="1"
        fill="gray"
        opacity="0.2"
      />
      <line
        opacity="0.4"
        x1={scale(summary.third)}
        x2={scale(summary.max)}
        strokeWidth="2px"
        y1={0}
        y2={0}
        stroke="black"
        strokeDasharray="4"
      />
      <Tick // Max Tick
        x1={scale(summary.median)}
        x2={scale(summary.median)}
        y1={-dimensions.attribute.plotHeight / 2}
        y2={dimensions.attribute.plotHeight / 2}
      />
      <Tick // Max Tick
        x1={scale(summary.max)}
        x2={scale(summary.max)}
      />
    </g>
  );
};
